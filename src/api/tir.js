import { apiv2 } from "./baseUrl";

export async function startTir() {
    const { data } = await apiv2.post("/startTir");
    return data;
}

export async function stopTir() {
    const { data } = await apiv2.post("/stopTir");
    return data;
}

export async function restartTir() {
    const { data } = await apiv2.post("/restartTir");
    return data;
}
