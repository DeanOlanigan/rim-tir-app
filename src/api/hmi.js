import { apiv2 } from "./baseUrl";

export async function getProjects() {
    const { data } = await apiv2.get("hmi/projects");
    return data;
}

export async function getProject(filename) {
    const { data } = await apiv2.get(`/hmi/project/${filename}`, {
        responseType: "blob",
    });
    return data;
}

export async function deleteProject(filename) {
    const { data } = await apiv2.delete(`/hmi/project/${filename}`);
    return data;
}

export async function saveProject({ filename, project }) {
    const formData = new FormData();
    formData.append("file", project, `${filename}.tir-project`);
    formData.append("name", filename);
    const safeFilename = encodeURIComponent(filename);
    const { data: res } = await apiv2.put(
        `/hmi/project/${safeFilename}`,
        formData,
    );
    return res;
}

export async function renameProject({ oldName, newName }) {
    const safeOldName = encodeURIComponent(oldName);
    const { data } = await apiv2.patch(`/hmi/project/${safeOldName}/rename`, {
        newName,
    });
    return data;
}
