import { apiv2 } from "../client";

export async function getLicense() {
    const response = await apiv2.get("/license");
    return response.data;
}

export async function activateLicense({ license }) {
    const response = await apiv2.post("/license/activate", { license });
    return response.data;
}
