import { apiv2 } from "../client";

function toCsv(value) {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.length ? value.join(",") : undefined;
    return value;
}

export async function getJournals({
    fromUTC,
    toUTC,
    limit,
    severity,
    category,
    before,
}) {
    const response = await apiv2.get("/journal", {
        params: {
            fromUTC,
            toUTC,
            limit,
            severity: toCsv(severity),
            category: toCsv(category),
            before,
        },
    });
    return response.data;
}

export async function downloadJournal({
    fromUTC,
    toUTC,
    limit,
    severity,
    category,
    format = "csv",
}) {
    const response = await apiv2.get("/journal/export", {
        params: {
            fromUTC,
            toUTC,
            limit,
            severity: toCsv(severity),
            category: toCsv(category),
            format,
        },
        responseType: "blob", // file
    });
    return response.data;
}

// Пока что оставляем command style API для квитирования
export async function ackJournalEvent({ eventId }) {
    const response = await apiv2.post("/journal/ack/event", { eventId });
    return response.data;
}

export async function ackJournalRange({ fromUTC, toUTC }) {
    // // ISO 8601 UTC
    const response = await apiv2.post("/journal/ack/range", { fromUTC, toUTC });
    return response.data;
}

// Пока что оставляем command style API для квитирования
export async function ackEvent({ eventId }) {
    const response = await apiv2.post(`/events/${eventId}/ack`);
    return response.data;
}

export async function ackEventRange({ fromUTC, toUTC }) {
    // // ISO 8601 UTC
    const response = await apiv2.post("/events/ack", { fromUTC, toUTC });
    return response.data;
}
