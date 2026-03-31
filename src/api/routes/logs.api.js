import { apiv2 } from "../client";

export async function getLogList() {
    const response = await apiv2.get("/logs");
    return response.data;
}

/**
 * get log
 * @returns response data
 */
export async function getLog({ name, limit }) {
    const response = await apiv2.get(`/logs/${name}`, {
        params: {
            limit,
        },
    });
    return response.data;
}

export async function downloadLogs({ names }) {
    const body = {
        items: names.map((name) => ({ name })),
    };
    const response = await apiv2.post("/logs/export", body, {
        responseType: "blob", // file
    });
    return response.data;
}
