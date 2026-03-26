import { apiv2 } from "../client";

// TODO Уточнить payload
export async function changeSignal({ id, payload }) {
    const response = await apiv2.put(`/signals/${id}`, { payload });
    return response.data;
}

export async function getSignalHistory({
    fromUTC,
    toUTC,
    pointLimit,
    variables,
}) {
    const response = await apiv2.post("/signals/history", {
        fromUTC, // ISO 8601 UTC
        toUTC,
        pointLimit,
        variables, // variables: [{ id }]
    });
    return response.data;
}
