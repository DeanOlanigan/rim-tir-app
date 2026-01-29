import { apiv2 } from "./baseUrl";

export async function getUsers() {
    const res = await apiv2.get("users");
    return res.data;
}
