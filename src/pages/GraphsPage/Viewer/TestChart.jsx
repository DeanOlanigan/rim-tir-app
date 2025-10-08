import { useMqttChart } from "@/pages/GraphsPage/Viewer/useMqttChart";
import { generateChartData } from "./useGeneratedChart";
import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    //TimeScale,
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

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    //TimeScale,
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

export const ExampleChart = ({ state, graphRef, type }) => {
    useMqttChart(graphRef, type);
    const data = generateChartData(state);
    console.log(data);

    const handleDBClick = () => {
        graphRef.current.resetZoom();
    };

    return (
        <Line
            ref={graphRef}
            data={data}
            options={createOptions(type, state)}
            onDoubleClick={handleDBClick}
        />
    );
};
