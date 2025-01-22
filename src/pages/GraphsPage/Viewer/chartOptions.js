import {
    Chart as ChartJS,
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
import zoomPlugin from "chartjs-plugin-zoom";
import { ru } from "date-fns/locale";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    zoomPlugin,
    Title,
    Tooltip,
    Legend
);

const graphPointTooltip = (context) => {
    return `
Ед. Измерения: ${context[0].raw.measurementUnit}
Описание: ${context[0].raw.variableDescription}
`;
};

export const options = {
    responsive: true,
    scales: {
        x: {
            type: "time",
            time: {
                tooltipFormat: "Pp",   // см. форматы date-fns: https://date-fns.org/v2.29.3/docs/format
                unit: "minute",
                displayFormats: {
                    minute: "HH:mm"
                }
            },
            adapters: {
                date: {
                    locale: ru // или ru для русского
                }
            }
        },
        y: {
            beginatAtZero: false
        }
    },
    plugins: {
        legend: {
            position: "top",
        },
        zoom: {
            pan: {
                enabled: true,
                mode: "x",
                modifierKey: "ctrl"
            },
            zoom: {
                drag: {
                    enabled: true
                },
                mode: "x"
            }
        },
        tooltip: {
            callbacks: {
                footer: function(context) {
                    return graphPointTooltip(context);
                }
            }
        }
    },
};