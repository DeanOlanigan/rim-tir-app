import { QK } from "@/api/queryKeys";
import { useMqttOverlayQuery } from "./useMqttOverlayQuery";
import { getConfiguration } from "@/api/configuration";
import { parseVarMessage, projectToCache } from "./mqttParse";

export function useConfigWithMqtt(enabled = true) {
    return useMqttOverlayQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        topic: "test/node/+",
        parseMessage: parseVarMessage,
        projectToCache: projectToCache,
        enabled,
    });
}
