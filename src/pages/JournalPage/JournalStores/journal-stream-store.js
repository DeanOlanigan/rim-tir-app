import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { formatJournalDate } from "../formatJournalDate";

const MAX_ROWS = 10000;

function getActorText(actor) {
    if (!actor) return "";
    return actor.name || actor.login || actor.id || "";
}

function getAckByText(ack) {
    if (!ack?.by) return "";
    return ack.by.name || ack.by.login || ack.by.id || "";
}

function isPendingAck(event) {
    return event?.ack?.state === "pending";
}

function enrichJournalEvent(event) {
    return {
        ...event,
        tsText: event.ts ? formatJournalDate(event.ts) : "",
        ackTimeText: event.ack?.at ? formatJournalDate(event.ack.at) : "",
        actorText: getActorText(event.actor),
        ackByText: getAckByText(event.ack),
    };
}

function buildEntities(rows) {
    const entities = {};
    for (const row of rows) {
        entities[row.id] = enrichJournalEvent(row);
    }
    return entities;
}

function buildMetaFromRows(rows) {
    let unackedCount = 0;
    let unackedAlarmCount = 0;
    let unackedWarningCount = 0;
    let unackedInfoCount = 0;

    for (const row of rows) {
        const bucket = getAckBlinkBucket(row);

        if (bucket) unackedCount += 1;

        if (bucket === "alarm") unackedAlarmCount += 1;
        if (bucket === "warning") unackedWarningCount += 1;
        if (bucket === "info") unackedInfoCount += 1;
    }

    return {
        newCount: 0,
        unackedCount,
        unackedAlarmCount,
        unackedWarningCount,
        unackedInfoCount,
        hasBlinkingAlarm:
            unackedAlarmCount > 0 ||
            unackedWarningCount > 0 ||
            unackedInfoCount > 0,
        seenThroughId: rows.length ? rows[rows.length - 1].id : null,
        lastOpenedAt: null,
    };
}

function trimState(ids, entities, max = MAX_ROWS) {
    if (ids.length <= max) {
        return { ids, entities };
    }

    const nextIds = ids.slice(ids.length - max);
    const nextEntities = {};

    for (const id of nextIds) {
        nextEntities[id] = entities[id];
    }

    return {
        ids: nextIds,
        entities: nextEntities,
    };
}

function getAckBlinkBucket(event) {
    if (!isPendingAck(event)) return null;

    if (event?.severity === "critical" || event?.severity === "error") {
        return "alarm";
    }

    if (event?.severity === "warning") {
        return "warning";
    }

    return "info";
}

function recalcMetaFromState(ids, entities, prevMeta) {
    let unackedCount = 0;
    let unackedAlarmCount = 0;
    let unackedWarningCount = 0;
    let unackedInfoCount = 0;

    for (const id of ids) {
        const event = entities[id];
        if (!event) continue;

        const bucket = getAckBlinkBucket(event);

        if (bucket) unackedCount += 1;

        if (bucket === "alarm") unackedAlarmCount += 1;
        if (bucket === "warning") unackedWarningCount += 1;
        if (bucket === "info") unackedInfoCount += 1;
    }

    let seenThroughId = prevMeta.seenThroughId;
    if (seenThroughId && !entities[seenThroughId]) {
        seenThroughId = ids.length ? ids[ids.length - 1] : null;
    }

    return {
        ...prevMeta,
        unackedCount,
        unackedAlarmCount,
        unackedWarningCount,
        unackedInfoCount,
        hasBlinkingAlarm:
            unackedAlarmCount > 0 ||
            unackedWarningCount > 0 ||
            unackedInfoCount > 0,
        seenThroughId,
    };
}

function applyAcknowledgedProjection(targetEvent, ackEvent) {
    const explicitAck = ackEvent?.payload?.ack;

    const ack = explicitAck
        ? explicitAck
        : {
              state: "acknowledged",
              by: ackEvent?.actor
                  ? {
                        id: ackEvent.actor.id ?? "",
                        login: ackEvent.actor.login ?? "",
                        name: ackEvent.actor.name ?? "",
                    }
                  : null,
              at: ackEvent?.ts ?? Date.now(),
          };

    return enrichJournalEvent({
        ...targetEvent,
        ack,
    });
}

/**
 * Обрабатывает логику подтверждения (acknowledgment) для конкретной сущности.
 */
function handleAcknowledgment(entities, incoming) {
    const targetId = incoming.payload?.targetEvent?.id;
    const currentTarget = targetId ? entities[targetId] : null;

    if (currentTarget && isPendingAck(currentTarget)) {
        entities[targetId] = applyAcknowledgedProjection(
            currentTarget,
            incoming,
        );
    }
}

function handleAcknowledgmentRange(entities, incoming) {
    const fromTs = incoming.payload?.fromTs;
    const toTs = incoming.payload?.toTs;

    for (const id of Object.keys(entities)) {
        const event = entities[id];
        if (!event) continue;

        if (event.ts >= fromTs && event.ts <= toTs) {
            entities[id] = applyAcknowledgedProjection(event, incoming);
        }
    }
}

/**
 * Обрабатывает одну входящую строку и обновляет состояние.
 */
function processRow(row, context) {
    const { nextEntities, nextIds } = context;

    if (!row?.id || nextEntities[row.id]) {
        return false;
    }

    const incoming = enrichJournalEvent(row);

    nextEntities[incoming.id] = incoming;
    nextIds.push(incoming.id);

    if (incoming.event === "event.acknowledged") {
        handleAcknowledgment(nextEntities, incoming);
    }

    if (incoming.event === "event.acknowledged.range") {
        handleAcknowledgmentRange(nextEntities, incoming);
    }

    return true;
}

function projectIncomingRows(state, rows) {
    if (!rows?.length) return state;

    let nextIds = [...state.ids];
    let nextEntities = { ...state.entities };
    let addedCount = 0;

    for (const row of rows) {
        const isAdded = processRow(row, { nextEntities, nextIds });
        if (isAdded) addedCount++;
    }

    if (addedCount === 0) return state;

    const { ids, entities } = trimState(nextIds, nextEntities, MAX_ROWS);

    const meta = recalcMetaFromState(ids, entities, {
        ...state.meta,
        newCount: state.meta.newCount + addedCount,
    });

    return {
        ids,
        entities,
        meta,
    };
}

export const useJournalStream = create(
    devtools(
        (set) => ({
            ids: [],
            entities: {},

            meta: {
                newCount: 0,
                unackedCount: 0,
                unackedAlarmCount: 0,
                unackedWarningCount: 0,
                unackedInfoCount: 0,
                hasBlinkingAlarm: false,
                seenThroughId: null,
                lastOpenedAt: null,
            },

            hydrate: (rows) =>
                set(
                    () => {
                        const trimmed = (rows ?? [])
                            .filter((r) => r?.id)
                            .slice(-MAX_ROWS);

                        const entries = buildEntities(trimmed);
                        const ids = trimmed.map((r) => r.id);
                        const meta = buildMetaFromRows(trimmed);

                        return {
                            ids,
                            entries,
                            meta,
                        };
                    },
                    undefined,
                    "journal/hydrate",
                ),

            push: (rows) =>
                set(
                    (state) => projectIncomingRows(state, rows),
                    undefined,
                    "journal/push",
                ),

            openJournal: () =>
                set(
                    (state) => ({
                        meta: {
                            ...state.meta,
                            newCount: 0,
                            lastOpenedAt: Date.now(),
                        },
                    }),
                    undefined,
                    "journal/openJournal",
                ),

            markSeenThrough: (id) =>
                set(
                    (state) => {
                        if (!id) return state;
                        if (!state.entities[id]) return state;
                        if (state.meta.seenThroughId === id) return state;

                        return {
                            meta: {
                                ...state.meta,
                                seenThroughId: id,
                            },
                        };
                    },
                    undefined,
                    "journal/markSeenThrough",
                ),

            reset: () =>
                set(
                    () => ({
                        ids: [],
                        entities: {},
                        meta: {
                            newCount: 0,
                            unackedCount: 0,
                            unackedAlarmCount: 0,
                            hasBlinkingAlarm: false,
                            seenThroughId: null,
                            lastOpenedAt: null,
                        },
                    }),
                    undefined,
                    "journal/reset",
                ),
        }),
        {
            name: "journal-stream",
        },
    ),
);
