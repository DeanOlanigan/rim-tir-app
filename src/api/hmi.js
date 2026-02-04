import { apiv2 } from "./baseUrl";

export async function getProjects() {
    const { data } = await apiv2.get("hmi/projects");
    return data;
}

export async function getProject(filename) {
    const { data } = await apiv2.get(`/hmi/project/${filename}`);
    return data;
}

export async function deleteProject(filename) {
    const { data } = await apiv2.delete(`/hmi/project/${filename}`);
    return data;
}

export async function saveProject({ filename, project }) {
    const safeFilename = encodeURIComponent(filename);
    const { data: res } = await apiv2.put(
        `/hmi/project/${safeFilename}`,
        project,
    );
    return res;
}
