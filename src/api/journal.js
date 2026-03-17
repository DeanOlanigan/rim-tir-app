import { apiv2 } from "./baseUrl";

function toCsv(value) {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.length ? value.join(",") : undefined;
    return value;
}

export async function getJournals({
    from,
    to,
    limit,
    severity,
    category,
    before,
}) {
    const params = {
        from,
        to,
        limit,
        severity: toCsv(severity),
        category: toCsv(category),
        before,
    };
    const { data } = await apiv2.get("journal", { params });
    return data;
}

export async function downloadJournal({ from, to, limit, severity, category }) {
    const params = {
        from,
        to,
        limit,
        severity,
        category,
    };
    const { data } = await apiv2.get("journal/export", { params });
    return data;
}
