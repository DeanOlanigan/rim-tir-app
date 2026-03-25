import { apiv2 } from "./client";

export async function getProjects() {
    const response = await apiv2.get("/hmi/projects");
    return response.data;
}

// TODO Уточнить payload в виде имени файла - лучше иметь uid проекта
export async function getProject({ filename }) {
    const response = await apiv2.get(`/hmi/project/${filename}`, {
        responseType: "blob",
    });
    return response.data;
}

export async function deleteProject({ filename }) {
    const response = await apiv2.delete(`/hmi/project/${filename}`);
    return response.data;
}

export async function saveProject({ filename, project }) {
    const formData = new FormData();
    formData.append("file", project, `${filename}.tir-project`);
    formData.append("name", filename);
    const safeFilename = encodeURIComponent(filename);
    const response = await apiv2.put(`/hmi/project/${safeFilename}`, formData);
    return response.data;
}

export async function renameProject({ oldName, newName }) {
    const safeOldName = encodeURIComponent(oldName);
    const response = await apiv2.patch(`/hmi/project/${safeOldName}/rename`, {
        newName,
    });
    return response.data;
}
