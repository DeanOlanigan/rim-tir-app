import { apiv2 } from "../client";

// Пока что оставляем command style API действий с системой
export async function startSystem() {
    const response = await apiv2.post("/system/start");
    return response.data;
}

export async function stopSystem() {
    const response = await apiv2.post("/system/stop");
    return response.data;
}

export async function restartSystem() {
    const response = await apiv2.post("/system/restart");
    return response.data;
}

// Получение версии тут смотрится как белая ворона
export async function getSoftwareVersion() {
    const response = await apiv2.get("/system/version");
    return response.data;
}
