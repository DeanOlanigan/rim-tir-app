import { apiv2 } from "./client";

// TODO Определиться в каком виде передавать данные конфигурации
export async function uploadConfiguration({ xml }) {
    const response = await apiv2.put("/configuration", xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
        transformRequest: [(d) => d],
    });
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
