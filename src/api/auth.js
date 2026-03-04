import { apiv2 } from "./baseUrl";

export async function getSession() {
    const { data } = await apiv2.get("/auth/session");
    return data;
}

export async function login(payload) {
    const { data } = await apiv2.post("/auth/login", payload);
    return data;
}

export async function logout() {
    const { data } = await apiv2.post("/auth/logout");
    return data;
}

export async function reauth(payload) {
    const { data } = await apiv2.post("/auth/reauth", payload);
    return data;
}
