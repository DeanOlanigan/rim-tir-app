import { apiv2 } from "./baseUrl";

export async function getProjects() {
    const { data } = await apiv2.get("hmi/projects");
    return data;
}
