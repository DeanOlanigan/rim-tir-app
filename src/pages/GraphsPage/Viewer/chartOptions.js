const graphPointTooltip = (context) => {
    return `
Ед. Измерения: ${context[0].raw.measurementUnit}
Описание: ${context[0].raw.variableDescription}
`;
};

export const createOptions = (color) => ({
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
            grid: {
                color: color,
            },
            ticks: {
                color: color,
            },
            border: {
                color: color,
            },
        },
        y: {
            beginatAtZero: false,
            grid: {
                color: color,
            },
            ticks: {
                color: color,
            },
            border: {
                color: color,
            },
        },
    },
    plugins: {
        legend: {
            position: "top",
            labels: {
                color: color,
            },
        },
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
        tooltip: {
            callbacks: {
                footer: function (context) {
                    return graphPointTooltip(context);
                },
            },
        },
    },
});
