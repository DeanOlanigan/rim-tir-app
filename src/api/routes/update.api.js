import { apiv2 } from "../client";

export async function initiateUpdate({ file }) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiv2.post("/update", formData);
    return response.data;
}

export async function checkUpdateStatus() {
    const response = await apiv2.get("/update/status");
    return response.data;
}
