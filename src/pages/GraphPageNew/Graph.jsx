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
import { useMemo, useRef } from "react";
import { generateChartData } from "./generateChartData";
import { Box, VStack } from "@chakra-ui/react";

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
    console.log("appliedConfig", appliedConfig);
    const chartRef = useRef(null);

    const chartData = useMemo(() => {
        return generateChartData(appliedConfig);
    }, [appliedConfig]);

    const options = useMemo(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            parsing: false,
            normalized: true,
            animation: true,
            interaction: {
                mode: "index",
                intersect: true,
                axis: "xy",
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    align: "end",
                    labels: {
                        usePointStyle: true,
                        boxWidth: 10,
                        boxHeight: 10,
                    },
                },
                tooltip: {
                    enabled: true,
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "x",
                    },
                    zoom: {
                        pinch: {
                            enabled: true,
                        },
                        wheel: {
                            enabled: true,
                        },
                        mode: "x",
                    },
                },
            },
            scales: {
                x: {
                    type: "time",
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                    },
                },
                y: {
                    beginAtZero: false,
                },
            },
        };
    }, []);

    return (
        <VStack w="full" h="full" align="stretch" gap={4}>
            {/* <GraphLegendContainer
                chartRef={chartRef}
                datasets={appliedConfig.datasets}
            /> */}

            <Box flex={1} minH="320px">
                <Line ref={chartRef} data={chartData} options={options} />
            </Box>
        </VStack>
    );
};
