import { useContext } from "react";
import WebSocketContext from "../../context/WebSocketContext";
import { Flex, Text } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";

function ConnectionStatus() {
    const { isConnected, serverTime } = useContext(WebSocketContext);

    return (
        <Flex align={"center"} gap={"2"} justify={"between"}>
            <LuTriangleAlert color="orange" style={{display: isConnected ? "none" : "" }}/>
            <Text textStyle={"sm"} fontWeight={"semibold"} textAlign={"center"} textWrap={"nowrap"} color={ isConnected ? "" : "orange"}>{ isConnected ? serverTime : "Нет соединения" }</Text>
        </Flex>        
    );
}

export default ConnectionStatus;
