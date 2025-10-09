import { memo, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
} from "chart.js";

ChartJS.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler
);

export const Sparkline = memo(function Sparkline({
    data,
    width = 96,
    height = 24,
    lineWidth = 1.5,
    tension = 0,
}) {
    const chartRef = useRef(null);

    const labels = useMemo(() => {
        const n = data.length;
        const arr = new Array(n);
        for (let i = 0; i < n; i++) arr[i] = i;
        return arr;
    }, [data.length]);

    const datasetIdKey = "spark";
    const chartData = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    [datasetIdKey]: datasetIdKey,
                    data,
                    borderWidth: lineWidth,
                    borderColor: "#0b8615ff",
                    backgroundColor: "#084617ff",
                    pointRadius: 0,
                    fill: true,
                    tension,
                },
            ],
        }),
        [labels, data, lineWidth, tension]
    );

    const options = useMemo(
        () => ({
            responsive: false, // работаем фикс. размерами
            maintainAspectRatio: false,
            animation: false, // нет анимации
            events: [], // без событий мыши
            parsing: false, // подаём готовые числа
            normalized: true,
            plugins: {
                title: { display: false },
                legend: { display: false },
                tooltip: { enabled: false },
                filler: { propagate: false },
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: { display: false },
                y: { display: false },
            },
        }),
        []
    );

    return (
        <Line
            ref={chartRef}
            data={chartData}
            options={options}
            width={width}
            height={height}
            datasetIdKey={datasetIdKey}
        />
    );
});
