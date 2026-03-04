import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { Badge, Icon } from "@chakra-ui/react";
import { LuWifi, LuWifiOff } from "react-icons/lu";
import { Tooltip } from "../ui/tooltip";

export const Connect = () => {
    const { connected } = useMqttCore();

    const color = connected ? "green" : "red";

    return (
        <Tooltip
            showArrow
            positioning={{ placement: "right" }}
            openDelay={150}
            content={
                connected
                    ? "Соединение установлено"
                    : "Соединение не установлено"
            }
        >
            <Badge
                flexDirection={"column"}
                w={"50px"}
                h={"50px"}
                variant={"outline"}
                justifyContent={"center"}
                colorPalette={color}
            >
                <Icon as={connected ? LuWifi : LuWifiOff} size={"md"} />
            </Badge>
        </Tooltip>
    );
};
