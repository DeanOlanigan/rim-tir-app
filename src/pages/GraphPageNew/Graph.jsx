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
import { Box, VStack } from "@chakra-ui/react";
import { useSignalHistoryQuery } from "./useSignalHistoryQuery";
import { useMqttChart } from "./useMqttChart";
import { createOptions } from "./chart-options";
import { createRealtimeDatasets } from "./createRealtimeDatasets";

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
    const isRealTime = appliedConfig?.mode === "realTime";

    const startMs = useMemo(() => {
        const value = appliedConfig?.range?.utcFrom;
        const ms = value ? new Date(value).getTime() : NaN;
        return Number.isFinite(ms) ? ms : undefined;
    }, [appliedConfig?.range?.utcFrom]);

    const endMs = useMemo(() => {
        const value = appliedConfig?.range?.utcTo;
        const ms = value ? new Date(value).getTime() : NaN;
        return Number.isFinite(ms) ? ms : undefined;
    }, [appliedConfig?.range?.utcTo]);

    const options = useMemo(() => {
        return createOptions(appliedConfig?.mode, startMs, endMs);
    }, [appliedConfig?.mode, startMs, endMs]);

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
            chart.update("quiet");
        }
    }, [isRealTime, appliedConfig]);

    if (!isRealTime && isLoading) return <div>Loading...</div>;
    if (!isRealTime && isError) return <div>Error: {error.message}</div>;

    return (
        <VStack w="full" h="full" align="stretch" gap={4}>
            <Box flex={1} minH="320px">
                <Line ref={chartRef} data={chartData} options={options} />
            </Box>
        </VStack>
    );
};
