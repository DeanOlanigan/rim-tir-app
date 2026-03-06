import { CONN_STATUS } from "@/config/constants";
import { useMqttMetrics } from "@/hooks/useMqttMetrics";
import { getMetricColor } from "@/utils/utils";
import { Tooltip } from "../ui/tooltip";
import { Badge, Icon, Text } from "@chakra-ui/react";

export function StatusTile({
    icon,
    label,
    sub,
    color,
    format = (value) => `${value}%`,
    collapsed,
}) {
    const { value, status } = useMqttMetrics(sub, {
        staleMs: 2500,
        timeoutMs: 5000,
    });

    let data = "----";
    if (status === CONN_STATUS.LIVE) data = format(value);

    const bg = getMetricColor(status, color);

    const wide = !collapsed;

    return (
        <Tooltip
            content={`${label}: ${data}`}
            positioning={{ placement: "right" }}
            openDelay={150}
        >
            <Badge
                colorPalette={bg}
                variant="outline"
                py={wide ? 2 : 1}
                px={wide ? 3 : 0}
                w={wide ? "100%" : "50px"}
                display="flex"
                flexDirection={wide ? "row" : "column"}
                alignItems="center"
                justifyContent="center"
                minW={0}
            >
                <Icon as={icon} boxSize="4" flexShrink={0} />

                {!wide && (
                    <Text
                        fontSize="2xs"
                        lineHeight="1"
                        textAlign="center"
                        userSelect="none"
                    >
                        {label}
                    </Text>
                )}

                {wide && (
                    <Text
                        fontSize="xs"
                        lineHeight="1"
                        userSelect="none"
                        flex="1"
                        truncate
                    >
                        {label}
                    </Text>
                )}

                <Text
                    fontSize="2xs"
                    fontWeight="600"
                    lineHeight="1"
                    textAlign="center"
                    truncate
                    userSelect="none"
                >
                    {data}
                </Text>
            </Badge>
        </Tooltip>
    );
}
