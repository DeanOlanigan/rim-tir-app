import { useMqttChart } from "@/pages/GraphsPage/Viewer/useMqttChart";
import { generateChartData } from "./useGeneratedChart";
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
import { createOptions } from "./chartOptions";
import { useQuery } from "@tanstack/react-query";
import { getGraphPoints } from "@/api/graph";
import { useGraphStore } from "../store/store";

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin,
    RealTimeScale,
    StreamingPlugin
);

const useGraphHistory = (state) => {
    const q = useQuery({
        queryKey: ["graph", state],
        queryFn: getGraphPoints(
            state.start,
            state.end,
            state.points,
            state.variables
        ),
    });

    return q;
};

export const ExampleChart = ({ graphRef }) => {
    const state = useGraphStore((state) => state);
    //const { data, isLoading, isError, error} = useGraphHistory(state);
    const data = generateChartData(state);

    useMqttChart(graphRef, state.type);

    const handleDBClick = () => {
        graphRef.current.resetZoom();
    };

    return (
        <Line
            ref={graphRef}
            data={data}
            options={createOptions(state)}
            onDoubleClick={handleDBClick}
        />
    );
};
