import { Flex, Text } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";
import websocketService from "../../services/websocketService";
import { useEffect, useState } from "react";

function ConnectionStatus() {
    const [serverTime, setServerTime] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        websocketService.connect();

        const messageHandler = (message) => {
            console.log(message[0]?.routerTime);
            setServerTime(message[0]?.routerTime || "");
        };

        websocketService.addMessageHandler(messageHandler);

        let t = 0;
        const internal = setInterval(() => {
            setIsConnected(websocketService.isConnected);
            if (websocketService.isConnected) {
                websocketService.sendMessage({ sys: ["OK", t] });
                t++;
            }
        }, 1000);

        return () => {
            clearInterval(internal);
            websocketService.removeMessageHandler(messageHandler);
        };
    }, []);

    return (
        <Flex align={"center"} gap={"2"} justify={"between"}>
            <LuTriangleAlert color="orange" style={{display: isConnected ? "none" : "" }}/>
            <Text
                textStyle={"sm"}
                fontWeight={"semibold"}
                textAlign={"center"}
                textWrap={"nowrap"}
                color={ isConnected ? "" : "orange"}
            >
                { isConnected ? serverTime : "Нет соединения" }
            </Text>
        </Flex>
    );
}

export default ConnectionStatus;
