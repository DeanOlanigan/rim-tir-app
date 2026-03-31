// src/pages/JournalPage/utils/journal-history-period.js
import { getLocalTimeZone } from "@internationalized/date";

function toCsv(value) {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.length ? value.join(",") : undefined;
    return value;
}

export function journalFiltersToApiPayload(filters) {
    const tz = getLocalTimeZone();

    const fromDate = filters.period?.from ?? null;
    const toDate = filters.period?.to ?? null;

    if (!fromDate || !toDate) {
        return {
            from: null,
            to: null,
            severity: Array.isArray(filters?.severity)
                ? toCsv(filters.severity)
                : [],
            category: Array.isArray(filters?.category)
                ? toCsv(filters.category)
                : [],
        };
    }

    // локальная полуночь начала диапазона
    const fromUtc = fromDate.toDate(tz).toISOString();

    // exclusive upper bound: начало следующего локального дня
    const toUtc = toDate.toDate(tz).toISOString();

    return {
        from: fromUtc,
        to: toUtc,
        severity: Array.isArray(filters?.severity)
            ? toCsv(filters.severity)
            : [],
        category: Array.isArray(filters?.category)
            ? toCsv(filters.category)
            : [],
    };
}
