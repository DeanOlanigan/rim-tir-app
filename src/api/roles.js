import { apiv2 } from "./baseUrl";

export async function getRoles() {
    const res = await apiv2.get("roles");
    return res.data;
}

export async function createRole(role) {
    const res = await apiv2.post("roles", role);
    return res.data;
}

export async function updateRole({ id, params }) {
    const res = await apiv2.put(`roles/${id}`, params);
    return res.data;
}

export async function deleteRole(id) {
    const res = await apiv2.delete(`roles/${id}`);
    return res.data;
}
