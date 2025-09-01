import { parseXmlToState } from "@/utils/xml/xmlToStore";
import { apiv2 } from "./baseUrl";

export async function startTir() {
    const { data } = await apiv2.post("/startTir");
    return data;
}

export async function stopTir() {
    const { data } = await apiv2.post("/stopTir");
    return data;
}

export async function restartTir() {
    const { data } = await apiv2.post("/restartTir");
    return data;
}

export async function uploadConfiguration(xml) {
    const { data } = await apiv2.put("/uploadConfiguration", xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
        transformRequest: [(d) => d],
    });
    return data;
}

export async function getConfiguration() {
    const { data } = await apiv2.get("/getConfiguration");
    const { state, configInfo } = parseXmlToState(data?.data);
    return { state, configInfo };
}
