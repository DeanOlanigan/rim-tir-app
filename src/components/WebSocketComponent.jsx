import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import PropTypes from "prop-types";
import { WebSocketContext } from "./WebSocketContext";

const WebSocketProvider = ({ children }) => {
    const hostname = '192.168.1.1';
    const [serverTime, setServerTime] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [t, setT] = useState(0);

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket('ws://'+ hostname +':8800', {
        shouldReconnect: () => true, 
    });

    useEffect(() => {
        if (lastMessage !== null) {
            try {
                const data = JSON.parse(lastMessage.data);
                if (data[0]?.error) {
                    console.error('Error:', data[0].error);
                }
                setServerTime(data[0]?.routerTime || '');
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        setIsConnected(readyState === ReadyState.OPEN);
    }, [readyState]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({sys : ["OK", t]})
                setT(( prevT ) => prevT + 1)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [readyState, t, sendJsonMessage])

    return (
        <WebSocketContext.Provider value={{ serverTime, isConnected, sendJsonMessage }}>
            { children }
        </WebSocketContext.Provider>
    )
}

WebSocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default WebSocketProvider;