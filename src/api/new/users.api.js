import { apiv2 } from "./client";

export async function getUsers() {
    const response = await apiv2.get("/users");
    return response.data;
}

export async function createUser({ user }) {
    const response = await apiv2.post("/users", { user });
    return response.data;
}

export async function updateUser({ id, user }) {
    const response = await apiv2.put(`/users/${id}`, { user });
    return response.data;
}

export async function deleteUser({ id }) {
    const response = await apiv2.delete("/users", { params: { id } });
    return response.data;
}

export async function changePassword({ id, password }) {
    const response = await apiv2.put(`/users/${id}/password`, { password });
    return response.data;
}
