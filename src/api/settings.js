import { apiv2 } from "./baseUrl";

export async function getSettings() {
    const res = await apiv2.get("settings");
    await new Promise((res) => setTimeout(res, 1000));
    return res.data;
}

export async function updateSettings(settings) {
    const res = await apiv2.put("settings", settings);
    return res;
}
