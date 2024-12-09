import { useContext } from "react";
import { WebSocketContext } from "../WebSocketContext";
import { Flex, Text } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

function ConnectionStatus() {
    const { isConnected, serverTime } = useContext(WebSocketContext);

    return (
        <Flex gap={'2'} align={'center'} justify={'between'}>
            <ExclamationTriangleIcon width={18} height={18} color='orange' display={ isConnected ? 'none' : 'block'}/>
            <Text weight='medium' color={ isConnected ? 'grass' : 'orange'}>{ isConnected ? serverTime : 'Нет соединения' }</Text>
        </Flex>        
    );
}

export default ConnectionStatus;