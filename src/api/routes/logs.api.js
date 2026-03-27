import { apiv2 } from "../client";

export async function getLogList() {
    const response = await apiv2.get("/logs");
    return response.data;
}

/**
 * get log
 * @param {string} format raw | json
 * @returns response data
 */
export async function getLog({ name, limit, format }) {
    const response = await apiv2.get(`/logs/${name}`, {
        params: {
            limit,
            format,
        },
    });
    return response.data;
}
