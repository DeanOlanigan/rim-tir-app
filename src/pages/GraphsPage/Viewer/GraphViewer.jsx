import { useEffect, useState, useRef } from "react";
import { HStack, IconButton, Card } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { Line } from "react-chartjs-2";

import WebSocketService from "../../../services/websocketService";
const wsService = new WebSocketService("ws://192.168.1.1:8800");

import { useGraphContext } from "../../../providers/GraphProvider/GraphContext";
import { options } from "./chartOptions";

function GraphViewer() {
    console.log("Render GraphViewer");
    const { createMessageForWS } = useGraphContext();
    const chartRef = useRef(null);

    const [data, setData] = useState({
        datasets: [],
    });

    const getColorForVariable = (variableName) => {
        const variables = createMessageForWS().graph.variables;
        const variable = variables.find((v) => v.variableName === variableName);
        return variable ? variable.color : "#000000"; // Цвет по умолчанию, если не найден
    };

    const updateDatasets = (newPoints, prevDatasets) =>{
        // Копируем предыдущие датасеты
        const updatedDatasets = [...prevDatasets];
                
        // Для каждой новой точки ищем/создаём датасет
        newPoints.forEach((point) => {
            const dsIndex = updatedDatasets.findIndex(
                (ds) => ds.label === point.variableName
            );

            if (dsIndex >= 0) {
                // Добавляем новую точку в существующий датасет
                updatedDatasets[dsIndex] = {
                    ...updatedDatasets[dsIndex],
                    data: [...updatedDatasets[dsIndex].data, point],
                };
            } else {
                // Если датасета нет, создаём новый
                const color = getColorForVariable(point.variableName);
                updatedDatasets.push({
                    label: point.variableName,
                    data: [point],
                    borderColor: color,
                    backgroundColor: color + "80", // слегка прозрачный
                });
            }
        });

        return updatedDatasets;
    };

    useEffect(() => {
        wsService.connect();

        const handleWebSocketMessage = (message) => {
            console.log(message);
    
            if (!Array.isArray(message) || message.length === 0) {
                console.warn("Received empty message from WebSocket");
                return;
            }
    
            const newPoints = message.map((el) => ({
                x: +el.timestamp, // parseInt если строка
                y: parseFloat(el.variableValue),
                variableDescription: el.variableDesc,
                measurementUnit: el.measureUnit,
                variableName: el.variableName, // сохраним тут же, чтобы удобно было ниже
            }));
    
            setData((prevData) => ({
                ...prevData,
                datasets: updateDatasets(newPoints, prevData.datasets),
            }));
        };

        wsService.addMessageHandler(handleWebSocketMessage); 
        wsService.sendMessage(createMessageForWS());

        return () => {
            wsService.removeMessageHandler(handleWebSocketMessage);
            wsService.close();
        };
    }, [createMessageForWS]);

    const handleDoubleClick = () => {
        const chart = chartRef.current;
        if (chart) {
            chart.resetZoom("active");
        };
    };

    return (
        <>
            <Card.Root
                w={"100%"}
                shadow={"xl"}
                data-state={"open"}
                animationDuration={"slow"}
                animationStyle={{
                    _open: "scale-fade-in",
                }}
            >
                <Card.Header>
                    <HStack>
                        <Link to="/graphs" >
                            <IconButton
                                size={"xs"}
                                shadow={"xs"}
                                variant={"outline"}
                            >
                                <LuArrowLeft/>
                            </IconButton>
                        </Link>
                    </HStack>
                </Card.Header>
                <Card.Body>
                    <Line ref={chartRef} options={options} data={data} onDoubleClick={handleDoubleClick}/>
                </Card.Body>
            </Card.Root>
        </>
    );
}

export default GraphViewer;
