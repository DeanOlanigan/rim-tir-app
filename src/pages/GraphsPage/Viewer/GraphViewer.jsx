import { useEffect, useState, useRef } from "react";
import { HStack, IconButton, Card } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import { Line } from "react-chartjs-2";
import { useColorModeValue } from "@/components/ui/color-mode";
import { createOptions } from "./chartOptions";

function GraphViewer() {
    console.log("Render GraphViewer");
    const chartRef = useRef(null);
    const backgroundColor = useColorModeValue("#3f3f46", "#71717a");
    const options = createOptions(backgroundColor);

    const [data, setData] = useState({
        datasets: [],
    });

    /* useEffect(() => {
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

        const updateDatasets = (newPoints, prevDatasets) => {
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

        const getColorForVariable = (variableName) => {
            const variables = wsMessage.graph.variables;
            const variable = variables.find(
                (v) => v.variableName === variableName
            );
            return variable ? variable.color : "#000000"; // Цвет по умолчанию, если не найден
        };

        wsService.addMessageHandler(handleWebSocketMessage);
        wsService.sendMessage(wsMessage);
        return () => {
            wsService.removeMessageHandler(handleWebSocketMessage);
            wsService.close();
        };
    }, []); */

    const resetZoom = () => {
        const chart = chartRef.current;
        if (chart) {
            chart.resetZoom("active");
        }
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
                        <IconButton
                            size={"xs"}
                            shadow={"xs"}
                            variant={"outline"}
                        >
                            <LuArrowLeft />
                        </IconButton>
                    </HStack>
                </Card.Header>
                <Card.Body>
                    <Line
                        ref={chartRef}
                        options={options}
                        data={data}
                        onDoubleClick={resetZoom}
                    />
                </Card.Body>
            </Card.Root>
        </>
    );
}

export default GraphViewer;
