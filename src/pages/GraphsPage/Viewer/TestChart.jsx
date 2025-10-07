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
import { TIME_TYPE } from "../GraphSettings/graphSettingsConstants";

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

/* const options = {
    responsive: true,
    scales: {
        x: {
            type: "time",
            time: {
                unit: "minute",
            },
        },
        y: {
            beginAtZero: false,
        },
    },
    plugins: {
        zoom: {
            pan: {
                enabled: true,
                mode: "x",
                modifierKey: "ctrl",
            },
            zoom: {
                drag: {
                    enabled: true,
                },
                mode: "x",
            },
        },
    },
}; */

export const ExampleChart = ({ state, graphRef, type }) => {
    useMqttChart(graphRef, type);
    const data = generateChartData(state);
    console.log(type);

    const handleDBClick = () => {
        graphRef.current.resetZoom();
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                type: type === TIME_TYPE.real ? "realtime" : "time",
            },
            y: {
                beginAtZero: false,
            },
        },
        plugins: {
            streaming: {
                delay: 1000,
                duration: 10000,
                ttl: 1000 * 60 * 5,
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
                limits: {
                    x: {
                        minDelay: 1000,
                        maxDelay: 1000 * 60,
                        minDuration: 10000,
                        maxDuration: 1000 * 60,
                    },
                },
            },
        },
    };

    return (
        <Line
            ref={graphRef}
            data={data}
            options={options}
            onDoubleClick={handleDBClick}
        />
    );
};
