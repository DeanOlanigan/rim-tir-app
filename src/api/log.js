import { apiv2 } from "./baseUrl";

export async function getLoglist() {
    const { data } = await apiv2.get("/loglist");
    return data;
}
