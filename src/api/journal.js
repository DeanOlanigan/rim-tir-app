import { apiv2 } from "./baseUrl";

export async function getJournals({ from, to, limit, before }) {
    const params = {
        from,
        to,
        limit,
        before,
    };
    const { data } = await apiv2.get("journal", { params });
    return data;
}
