import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { Badge, Icon, Text } from "@chakra-ui/react";
import { LuCloudOff } from "react-icons/lu";
import { Tooltip } from "../ui/tooltip";

export const Connect = ({ collapsed }) => {
    const { connected } = useMqttCore();
    const status = "Нет соединения";

    return (
        !connected && (
            <Tooltip
                showArrow
                positioning={{ placement: "right" }}
                openDelay={150}
                content={status}
            >
                <Badge
                    w={collapsed ? "50px" : "100%"}
                    py={collapsed ? 3 : 2}
                    px={collapsed ? 1 : 3}
                    variant={"outline"}
                    justifyContent={collapsed ? "center" : "flex-start"}
                    colorPalette={"red"}
                >
                    <Icon as={LuCloudOff} size={"sm"} />
                    {!collapsed && (
                        <Text
                            fontWeight="medium"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                        >
                            {status}
                        </Text>
                    )}
                </Badge>
            </Tooltip>
        )
    );
};
