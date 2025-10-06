import { Flex, Text } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";
import { useEffect, useState } from "react";

function ConnectionStatus() {
    const [serverTime, setServerTime] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    /* useEffect(() => {
        wsService.connect();

        const messageHandler = (message) => {
            //console.log(message[0]?.routerTime);
            setServerTime(message[0]?.routerTime || "");
        };

        wsService.addMessageHandler(messageHandler);

        const internal = setInterval(() => {
            setIsConnected(wsService.isConnected);
            if (wsService.isConnected) {
                wsService.sendMessage({ action: "getTime" });
            }
        }, 1000);

        return () => {
            clearInterval(internal);
            wsService.removeMessageHandler(messageHandler);
        };
    }, []); */

    return (
        <Flex align={"center"} gap={"2"} justify={"between"}>
            <LuTriangleAlert
                color="orange"
                style={{ display: isConnected ? "none" : "" }}
            />
            <Text
                textStyle={"sm"}
                fontWeight={"semibold"}
                textAlign={"center"}
                textWrap={"nowrap"}
                color={isConnected ? "" : "orange"}
            >
                {isConnected ? serverTime : "Нет соединения"}
            </Text>
        </Flex>
    );
}

export default ConnectionStatus;
