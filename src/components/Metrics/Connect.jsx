import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { Icon } from "@chakra-ui/react";
import { LuWifi, LuWifiOff } from "react-icons/lu";

export const Connect = () => {
    const { connected } = useMqttCore();

    return (
        <Icon
            as={connected ? LuWifi : LuWifiOff}
            color={connected ? "green.600" : "red.500"}
            size={"xs"}
            title={
                connected
                    ? "Соединение установлено"
                    : "Соединение не установлено"
            }
        />
    );
};
