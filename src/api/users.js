import { apiv2 } from "./baseUrl";

export async function getUsers() {
    const res = await apiv2.get("users");
    return res.data;
}

export async function createUser(user) {
    const res = await apiv2.post("users", user);
    return res.data;
}

export async function updateUsers(users) {
    const res = await apiv2.put("users", users);
    return res.data;
}

export async function deleteUsers(ids) {
    const res = await apiv2.delete(`users?ids=${ids}`);
    return res.data;
}

export async function changePassword({ userId, editedPassword }) {
    const res = await apiv2.put("/users/password", { userId, editedPassword });
    return res;
}
