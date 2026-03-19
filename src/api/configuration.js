import { parseXmlToState } from "@/utils/xml/xmlToStore";
import { apiv2 } from "./baseUrl";

export async function uploadConfiguration(xml) {
    const { data } = await apiv2.put("/configuration", xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
        transformRequest: [(d) => d],
    });
    return data;
}

export async function getConfiguration() {
    const { data } = await apiv2.get("/configuration");
    return parseXmlToState(data?.data);
}

export async function getVariables() {
    const { data } = await apiv2.get("/configuration/variables");
    return data;
}

export async function getGraphVariables() {
    try {
        const { data } = await apiv2.get("/configuration/variables/graph");
        return data?.data ?? [];
    } catch (error) {
        throw new Error(
            error?.response?.data?.message || "Не удалось получить переменные",
        );
    }
}
