import { CONN_STATUS } from "@/config/constants";
import { useMqttMetrics } from "@/hooks/useMqttMetrics";
import { getMetricColor } from "@/utils/utils";
import { Badge, Text } from "@chakra-ui/react";
import { LuMemoryStick } from "react-icons/lu";

export const MqttRam = () => {
    const { value, status } = useMqttMetrics("stats/ram", {
        staleMs: 2500,
        timeoutMs: 5000,
    });

    let ram = "----";
    if (status === CONN_STATUS.LIVE) {
        ram = `${value}%`;
    }

    return (
        <Badge
            variant={"subtle"}
            colorPalette={getMetricColor(status, "orange")}
            size={"xs"}
        >
            <LuMemoryStick />
            <Text minW={"4ch"}>{ram}</Text>
        </Badge>
    );
};
