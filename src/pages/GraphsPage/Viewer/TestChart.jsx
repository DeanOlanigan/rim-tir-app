import { useMqttChart } from "@/pages/GraphsPage/Viewer/useMqttChart";
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
import { useQuery } from "@tanstack/react-query";
import { getGraphPoints } from "@/api/graph";

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

export const ExampleChart = ({
    graphRef,
    data,
    type,
    options,
    onDoubleClick,
}) => {
    //const { data, isLoading, isError, error} = useGraphHistory(state);
    useMqttChart(graphRef, type);
    return (
        <Line
            ref={graphRef}
            data={data}
            options={options}
            onDoubleClick={onDoubleClick}
        />
    );
};
