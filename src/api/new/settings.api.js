import { apiv2 } from "./client";

export async function getSettings() {
    const response = await apiv2.get("/settings");
    return response.data;
}

export async function updateSettings({ settings }) {
    const response = await apiv2.put("/settings", { settings });
    return response.data;
}
