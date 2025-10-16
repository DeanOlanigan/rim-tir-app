import { apiv1 } from "./baseUrl";

export async function getSoftwareVer() {
    const { data } = await apiv1.get("/softwareVer");
    return data;
}
