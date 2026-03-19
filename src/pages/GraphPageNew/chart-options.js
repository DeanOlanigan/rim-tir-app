export function createOptions(mode, start, end) {
    const isRealTime = mode === "realTime";

    return {
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,
        normalized: true,
        animation: false,
        scales: {
            x: {
                type: isRealTime ? "realtime" : "time",
                grid: {
                    color: "#6666663f",
                },
            },
            y: {
                beginAtZero: false,
                grid: {
                    color: "#6666663f",
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: "top",
                align: "end",
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                    boxHeight: 10,
                },
            },
            zoom: createZoomOptions(mode, start, end),
            streaming: isRealTime ? streamingOptions : undefined,
        },
    };
}

function createZoomOptions(mode, start, end) {
    const isRealTime = mode === "realTime";

    return {
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
            x: isRealTime ? realtimeLimits : createArchiveLimits(start, end),
        },
    };
}

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

function createArchiveLimits(start, end) {
    return {
        ...(Number.isFinite(start) ? { min: start } : {}),
        ...(Number.isFinite(end) ? { max: end } : {}),
        minRange: 1000 * 30,
    };
}
