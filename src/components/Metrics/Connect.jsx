import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { Badge, Icon, Text } from "@chakra-ui/react";
import { LuWifi, LuWifiOff } from "react-icons/lu";
import { Tooltip } from "../ui/tooltip";

export const Connect = () => {
    const { connected } = useMqttCore();

    const color = connected ? "green" : "red";
    const status = connected
        ? "Соединение установлено"
        : "Соединение разорвано";

    return (
        <Tooltip
            showArrow
            positioning={{ placement: "right" }}
            openDelay={150}
            content={status}
        >
            <Badge
                w={{ base: "50px", lg: "100%" }}
                h={{ base: "50px", lg: "auto" }}
                py={{ base: 1, lg: 2 }}
                px={{ base: 0, lg: 3 }}
                variant={"outline"}
                justifyContent={{ base: "center", lg: "flex-start" }}
                colorPalette={color}
            >
                <Icon
                    as={connected ? LuWifi : LuWifiOff}
                    size={{ base: "md", lg: "sm" }}
                />
                <Text
                    display={{ base: "none", lg: "block" }}
                    fontSize={{ base: "sm", lg: "xs" }}
                    fontWeight="medium"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                >
                    {status}
                </Text>
            </Badge>
        </Tooltip>
    );
};
