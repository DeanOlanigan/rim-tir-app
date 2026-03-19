import { apiv2 } from "./baseUrl";

export async function getSignalHistory(payload) {
    const { data } = await apiv2.post("signals/history", payload);
    return data;
}
