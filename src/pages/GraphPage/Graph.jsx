import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "chartjs-adapter-luxon";
import zoomPlugin from "chartjs-plugin-zoom";
import {
    RealTimeScale,
    StreamingPlugin,
} from "@robloche/chartjs-plugin-streaming";
import { useEffect, useMemo, useRef } from "react";
import { Box, Button, HStack, Icon, Kbd, Text, VStack } from "@chakra-ui/react";
import { useSignalHistoryQuery } from "./useSignalHistoryQuery";
import { useMqttChart } from "./useMqttChart";
import { createOptions } from "./chart-options";
import { createRealtimeDatasets } from "./createRealtimeDatasets";
import { useChartController } from "./useChartController";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { Tooltip as ChakraTooltip } from "@/components/ui/tooltip";
import { LuMouse } from "react-icons/lu";

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin,
    RealTimeScale,
    StreamingPlugin,
);

export const Graph = ({ appliedConfig }) => {
    const chartRef = useRef(null);
    const isRealTime = appliedConfig?.mode === "realTime";

    const options = useMemo(() => {
        return createOptions(appliedConfig);
    }, [appliedConfig]);

    const { paused, resetZoom, togglePause } = useChartController(chartRef);

    const { data, isLoading, isError, error } =
        useSignalHistoryQuery(appliedConfig);

    const realtimeData = useMemo(() => {
        return {
            datasets: createRealtimeDatasets(appliedConfig),
        };
    }, [appliedConfig]);

    const chartData = isRealTime
        ? realtimeData
        : (data?.chartData ?? { datasets: [] });

    useMqttChart(chartRef, appliedConfig);

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        if (isRealTime) {
            for (const dataset of chart.data.datasets) {
                dataset.data = [];
            }
            chart.update("none");
        }
    }, [isRealTime]);

    if (!isRealTime && isLoading) return <div>Loading...</div>;
    if (!isRealTime && isError) return <div>Error: {error.message}</div>;

    return (
        <VStack w="full" h="full" align="stretch" gap={4} position={"relative"}>
            <HStack position={"absolute"} top={0} left={8}>
                <ChakraTooltip
                    showArrow
                    content={
                        <Box>
                            <Text>
                                Используйте <Kbd size={"sm"}>Ctrl</Kbd> +
                                колесико мыши для масштабирования
                            </Text>
                            <Text>
                                Используйте{" "}
                                <Kbd size={"sm"}>
                                    <Icon as={LuMouse} />
                                </Kbd>{" "}
                                для перемещения
                            </Text>
                        </Box>
                    }
                >
                    <Icon
                        as={FaRegCircleQuestion}
                        boxSize={5}
                        color={"colorPalette.fg"}
                    />
                </ChakraTooltip>
                {isRealTime && (
                    <Button
                        variant={"outline"}
                        size={"2xs"}
                        onClick={togglePause}
                    >
                        {paused ? "Продолжить" : "Пауза"}
                    </Button>
                )}
                <Button variant={"outline"} size={"2xs"} onClick={resetZoom}>
                    Сбросить масштаб
                </Button>
            </HStack>
            <Box flex={1} minH="320px">
                <Line
                    key={isRealTime ? "realtime" : "period"}
                    ref={chartRef}
                    data={chartData}
                    options={options}
                    onDoubleClick={resetZoom}
                />
            </Box>
        </VStack>
    );
};
