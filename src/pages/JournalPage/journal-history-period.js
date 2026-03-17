// src/pages/JournalPage/utils/journal-history-period.js
import { getLocalTimeZone } from "@internationalized/date";

export function journalFiltersToApiPayload(filters) {
    const tz = getLocalTimeZone();

    const fromDate = filters.period?.from ?? null;
    const toDate = filters.period?.to ?? null;

    if (!fromDate || !toDate) {
        return {
            from: null,
            to: null,
            severity: Array.isArray(filters?.severity) ? filters.severity : [],
            category: Array.isArray(filters?.category) ? filters.category : [],
        };
    }

    // локальная полуночь начала диапазона
    const fromUtc = fromDate.toDate(tz).toISOString();

    // exclusive upper bound: начало следующего локального дня
    const toUtc = toDate.toDate(tz).toISOString();

    return {
        from: fromUtc,
        to: toUtc,
        severity: Array.isArray(filters?.severity) ? filters.severity : [],
        category: Array.isArray(filters?.category) ? filters.category : [],
    };
}
