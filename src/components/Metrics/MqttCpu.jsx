import { CONN_STATUS } from "@/config/constants";
import { useMqttMetrics } from "@/hooks/useMqttMetrics";
import { getMetricColor } from "@/utils/utils";
import { Badge, Text } from "@chakra-ui/react";
import { LuCpu } from "react-icons/lu";

export const MqttCpu = () => {
    const { value, status } = useMqttMetrics("stats/cpu", {
        staleMs: 2500,
        timeoutMs: 5000,
    });

    let cpu = "----";
    if (status === CONN_STATUS.LIVE) {
        cpu = `${value}%`;
    }

    return (
        <Badge
            variant={"subtle"}
            colorPalette={getMetricColor(status, "purple")}
            size={"xs"}
        >
            <LuCpu />
            <Text minW={"4ch"}>{cpu}</Text>
        </Badge>
    );
};
