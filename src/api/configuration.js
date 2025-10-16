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
    const { state, configInfo } = parseXmlToState(data?.data);
    return { state, configInfo };
}
