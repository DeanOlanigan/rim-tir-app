import { apiv2 } from "./client";

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
}) {
    const response = await apiv2.get("/journal/export", {
        params: {
            fromUTC,
            toUTC,
            limit,
            severity: toCsv(severity),
            category: toCsv(category),
        },
        responseType: "blob",
    });
    return response.data;
}

export async function eventAcknowledge({ id }) {
    const response = await apiv2.post("/journal/ack/event", { id });
    return response.data;
}

export async function eventAcknowledgeRange({ fromUTC, toUTC }) {
    // // ISO 8601 UTC
    const response = await apiv2.post("/journal/ack/range", { fromUTC, toUTC });
    return response.data;
}
