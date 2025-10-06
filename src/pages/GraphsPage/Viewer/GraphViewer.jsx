import { HStack, IconButton, Card } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import { useGraphStore } from "../store/store";
import { generateChartData } from "./useGeneratedChart";

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
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
//import zoomPlugin from "chartjs-plugin-zoom";
import {
    RealTimeScale,
    StreamingPlugin,
} from "@robloche/chartjs-plugin-streaming";
import { useRef } from "react";
import { useMqttChart } from "@/pages/LogPage/Viewer/useMqttChart";

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    //TimeScale,
    Title,
    Tooltip,
    Legend,
    //zoomPlugin,
    RealTimeScale,
    StreamingPlugin
);

function GraphViewer() {
    const state = useGraphStore((state) => state);

    const handleBack = () => {
        useGraphStore.getState().setShowGraph(false);
    };

    return (
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
                        onClick={handleBack}
                    >
                        <LuArrowLeft />
                    </IconButton>
                </HStack>
            </Card.Header>
            <Card.Body>
                <ExampleChart state={state} />
            </Card.Body>
        </Card.Root>
    );
}

export default GraphViewer;

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

const ExampleChart = ({ state }) => {
    const bufferRef = useMqttChart();
    const graphRef = useRef();
    const data = generateChartData(state);
    const handleDBClick = () => {
        graphRef.current.resetZoom();
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                type: "realtime",
                realtime: {
                    duration: 20000,
                    refresh: 100,
                    onRefresh: (chart) => {
                        const buf = bufferRef.current;
                        if (!buf) return;

                        const dsByLabel = new Map();
                        chart.data.datasets.forEach((ds) => {
                            dsByLabel.set(ds.label, ds);
                        });

                        for (const name of Object.keys(buf)) {
                            const points = buf[name];
                            if (!points?.length) continue;

                            let ds = dsByLabel.get(name);
                            ds.data.push(...points);
                            buf[name] = [];
                        }
                    },
                },
            },
            y: {
                beginAtZero: false,
            },
        },
        plugins: {
            streaming: {
                duration: 20000,
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
