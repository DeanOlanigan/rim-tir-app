import { apiv2 } from "./client";

export async function getLoglist() {
    const response = await apiv2.get("/logs/list");
    return response.data;
}

export async function getLog({ name, dir, limit, format }) {
    const response = await apiv2.get("/logs/log", {
        params: {
            name,
            dir,
            limit,
            format,
        },
    });
    return response.data;
}
