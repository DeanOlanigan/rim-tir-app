import { apiv2 } from "../client";

export async function getRoles() {
    const response = await apiv2.get("/roles");
    return response.data;
}

export async function createRole({ role }) {
    const response = await apiv2.post("/roles", { role });
    return response.data;
}

export async function updateRole({ id, role }) {
    const response = await apiv2.put(`/roles/${id}`, { role });
    return response.data;
}

export async function deleteRole({ id }) {
    const response = await apiv2.delete(`/roles/${id}`);
    return response.data;
}
