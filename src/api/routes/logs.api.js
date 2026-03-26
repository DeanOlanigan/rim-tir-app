import { apiv2 } from "../client";

export async function getLogList() {
    const response = await apiv2.get("/logs");
    return response.data;
}

/**
 * get log
 * @param {string} dir sd | internal
 * @param {string} format raw | json
 * @returns response data
 */
// TODO: Потенциально убрать dir, т.к. сервер будет сам определять место хранения данных
export async function getLog({ name, dir, limit, format }) {
    const response = await apiv2.get(`/logs/${dir}/${name}`, {
        params: {
            limit,
            format,
        },
    });
    return response.data;
}
