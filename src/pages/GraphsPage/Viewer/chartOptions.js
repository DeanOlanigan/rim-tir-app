import { TIME_TYPE } from "../GraphSettings/graphSettingsConstants";

export const createOptions = (type, start, end) => ({
    responsive: true,
    scales: {
        x: {
            type: type === TIME_TYPE.real ? "realtime" : "time",
            grid: {
                color: "#6666663f",
            },
        },
        y: {
            beginatAtZero: false,
            grid: {
                color: "#6666663f",
            },
        },
    },
    plugins: {
        zoom: zoomOptions(type, start, end),
        streaming: streamingOptions,
    },
});

const zoomOptions = (type, start, end) => ({
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
        x: type === TIME_TYPE.real ? realtimeLimits : archiveLimits(start, end),
    },
});

const streamingOptions = {
    delay: 1000,
    duration: 1000 * 10,
    ttl: 1000 * 60 * 5,
};

const realtimeLimits = {
    minDelay: 1000,
    maxDelay: 1000 * 60,
    minDuration: 1000 * 10,
    maxDuration: 1000 * 60 * 5,
};

const archiveLimits = (start, end) => ({
    min: start,
    max: end,
    minRange: 1000 * 30,
});

/* const graphPointTooltip = (context) => {
    return `
Ед. Измерения: ${context[0].raw.measurementUnit}
Описание: ${context[0].raw.variableDescription}
`;
}; */
