import { CONN_STATUS } from "@/config/constants";
import { useMqttMetrics } from "@/hooks/useMqttMetrics";
import { getMetricColor } from "@/utils/utils";
import { Badge, Text } from "@chakra-ui/react";
import { LuClock } from "react-icons/lu";

export const MqttTime = () => {
    const { value, status } = useMqttMetrics("stats/time", {
        staleMs: 2500,
        timeoutMs: 5000,
    });

    let time = "-------";
    if (status === CONN_STATUS.LIVE) {
        time = new Date(value).toLocaleTimeString();
    }

    return (
        <Badge
            variant={"subtle"}
            colorPalette={getMetricColor(status, "green")}
        >
            <LuClock />
            <Text minW={"7ch"}>{time}</Text>
        </Badge>
    );
};
