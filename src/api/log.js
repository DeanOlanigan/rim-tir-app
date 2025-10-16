import { apiv2 } from "./baseUrl";

export async function getLoglist() {
    const { data } = await apiv2.get("/loglist");
    return data;
}

export async function getLog(name, type, limit, format) {
    const { data } = await apiv2.get(
        `/log?name=${name}&dir=${type}&limit=${limit}&format=${format}`
    );
    return data;
}
