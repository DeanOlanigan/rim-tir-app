import { useCallback, useMemo } from "react";
import { useFilterStore } from "./JournalStores/filter-store";
import { useJournalStream } from "./JournalStores/journal-stream-store";
import { JOURNAL_LIVE_COLUMNS } from "./JournalView/tableColumns";
import { useFilterData } from "./hooks/useFilterData";
import { MenuTypes } from "./JournalFilter/MenuFilters/MenuTypes";
import { MenuCategories } from "./JournalFilter/MenuFilters/MenuCategories";
import { AckButtonRange } from "./JournalView/AckButtonRange";
import { hasRight } from "@/utils/permissions";
import { JournalLiveTableBase } from "./JournalView/JournalLiveTableBase";
import { useAckEventStreamMutation } from "./hooks/useAckEventMutation";
import { useAckRangeStreamMutation } from "./hooks/useAckRangeMutation";

const getFrom = () => {
    const state = useJournalStream.getState();
    const firstId = state.ids?.[0];
    const ts = firstId ? state.entities?.[firstId]?.ts : null;
    return ts ?? Date.now();
};

const getTo = () => {
    return Date.now();
};

export const JournalLiveTable = () => {
    const ids = useJournalStream((s) => s.ids);
    const entities = useJournalStream((s) => s.entities);
    const selectedMessages = useFilterStore((s) => s.selectedMessages);
    const selectedCategory = useFilterStore((s) => s.selectedCategory);

    const ackRangeMutation = useAckRangeStreamMutation();
    const ackEventMutation = useAckEventStreamMutation();

    const rowData = useMemo(
        () => ids.map((id) => entities[id]),
        [ids, entities],
    );

    const data = useFilterData(rowData, selectedMessages, selectedCategory);

    const renderLiveHeaderContent = useCallback(
        ({ column, user }) => {
            if (column.value === "type")
                return <MenuTypes name={column.label} />;
            if (column.value === "category")
                return <MenuCategories name={column.label} />;
            if (column.value === "needAck" && hasRight(user, "journal.ack")) {
                return (
                    <AckButtonRange
                        tooltip={"Квитировать все события текущей сессии"}
                        confirmMessage={
                            "Будут квитированы все события текущей сессии"
                        }
                        onAccept={() => {
                            const fromTs = getFrom();
                            const toTs = getTo();
                            ackRangeMutation.mutate({ fromTs, toTs });
                        }}
                    />
                );
            }
            return column.label;
        },
        [ackRangeMutation],
    );

    const onAckEvent = useCallback(
        (event) => {
            ackEventMutation.mutate({
                eventId: event.id,
                event: event.event,
                message: `Квитирование события ${event.event}`,
            });
        },
        [ackEventMutation],
    );

    const isAckEventPending = useCallback(
        (event) =>
            ackEventMutation.isPending &&
            ackEventMutation.variables?.eventId === event.id,
        [ackEventMutation],
    );

    return (
        <JournalLiveTableBase
            columns={JOURNAL_LIVE_COLUMNS}
            data={data}
            renderHeaderContent={renderLiveHeaderContent}
            onAckEvent={onAckEvent}
            isAckEventPending={isAckEventPending}
        />
    );
};
