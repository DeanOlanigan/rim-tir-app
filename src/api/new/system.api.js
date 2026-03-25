import { apiv2 } from "./client";

export async function startTir() {
    const response = await apiv2.post("/system/start");
    return response.data;
}

export async function stopTir() {
    const response = await apiv2.post("/system/stop");
    return response.data;
}

export async function restartTir() {
    const response = await apiv2.post("/system/restart");
    return response.data;
}

export async function getSoftwareVersion() {
    const response = await apiv2.get("/system/version");
    return response.data;
}
