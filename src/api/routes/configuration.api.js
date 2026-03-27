import { apiv2 } from "../client";

export async function uploadConfiguration({ config }) {
    const response = await apiv2.put("/configuration", { config });
    return response.data;
}

export async function getConfiguration() {
    const response = await apiv2.get("/configuration");
    return response.data;
}

export async function getVariables() {
    const response = await apiv2.get("/configuration/variables");
    return response.data;
}

export async function getGraphVariables() {
    const response = await apiv2.get("/configuration/variables/graph");
    return response.data;
}
