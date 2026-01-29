import { apiv2 } from "./baseUrl";

export async function getRoles() {
    const res = await apiv2.get("roles");
    return res.data;
}
