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
import { useChartDataSource } from "../hooks";

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

export const ExampleChart = ({
    graphRef,
    data,
    type,
    options,
    onDoubleClick,
}) => {
    useChartDataSource(graphRef, type);

    return (
        <Line
            ref={graphRef}
            data={data}
            options={options}
            onDoubleClick={onDoubleClick}
        />
    );
};
