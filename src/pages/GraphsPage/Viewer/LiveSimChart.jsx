import { Box } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import { useLiveChart } from "./useLiveChart";
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { ru } from "date-fns/locale";

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend
);

export const ChartJsLiveView = ({ chart }) => {
    const datasets = (chart.series ?? []).map((s) => {
        const color = chart.color(s.color);
        return {
            label: s.name,
            data: chart.data.map((d) => ({ x: d.date, y: d[s.name] })),
            borderWidth: 2,
            borderColor: color,
            backgroundColor: color,
            pointRadius: 0,
            tension: 0.25,
            fill: true,
        };
    });

    const data = { datasets };

    const options = {
        parsing: false,
        animation: false,
        responsive: true,
        scales: {
            x: {
                type: "time",
                time: {
                    tooltipFormat: "Pp", // см. форматы date-fns: https://date-fns.org/v2.29.3/docs/format
                    unit: "minute",
                    displayFormats: {
                        minute: "HH:mm",
                    },
                },
                adapters: {
                    date: {
                        locale: ru, // или ru для русского
                    },
                },
                ticks: {
                    color: "#9ca3af",
                },
                border: {
                    color: "#9ca3af",
                },
                grid: {
                    color: "#9ca3af",
                },
            },
            y: {
                beginAtAtZero: false,
                grid: {
                    color: "#9ca3af",
                },
                ticks: {
                    color: "#9ca3af",
                },
                border: {
                    color: "#9ca3af",
                },
            },
        },
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#9ca3af",
                },
            },
            tooltip: {
                callbacks: {
                    footer: function (context) {
                        return `
Ед. Измерения: ${context[0].raw.measurementUnit}
Описание: ${context[0].raw.variableDescription}
`;
                    },
                },
            },
        },
    };

    return (
        <Box w={"100%"} h={"320px"}>
            <Line data={data} options={options} />
        </Box>
    );
};

export const LiveSimChart = ({ config }) => {
    const { chart } = useLiveChart(config);

    return <ChartJsLiveView chart={chart} />;
};
