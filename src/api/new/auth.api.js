import { apiv2 } from "./client";

export async function getSession() {
    const response = await apiv2.get("/auth/session");
    return response.data;
}

export async function login({ login, password }) {
    const response = await apiv2.post("/auth/login", { login, password });
    return response.data;
}

export async function logout() {
    const response = await apiv2.post("/auth/logout");
    return response.data;
}

export async function reauth({ password }) {
    const response = await apiv2.post("/auth/reauth", { password });
    return response.data;
}
