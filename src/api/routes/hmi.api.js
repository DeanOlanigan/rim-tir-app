import { apiv2 } from "../client";

export async function getProjects() {
    const response = await apiv2.get("/hmi/projects");
    return response.data;
}

export async function getProject({ id }) {
    const response = await apiv2.get(`/hmi/projects/${id}`, {
        responseType: "blob",
    });
    return response.data;
}

export async function deleteProject({ id }) {
    const response = await apiv2.delete(`/hmi/projects/${id}`);
    return response.data;
}

export async function saveProject({ id, blob }) {
    const formData = new FormData();
    formData.append("file", blob);
    const response = await apiv2.put(`/hmi/projects/${id}`, formData);
    return response.data;
}
