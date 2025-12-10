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
import { useSpark } from "../../store/mqtt-stream-store";

ChartJS.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
);

const chartAreaBorder = {
    id: "chartAreaBorder",
    beforeDraw(chart, args, options) {
        const {
            ctx,
            chartArea: { left, top, width, height },
        } = chart;
        ctx.save();
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.setLineDash(options.borderDash || []);
        ctx.lineDashOffset = options.borderDashOffset;
        ctx.strokeRect(left, top, width, height);
        ctx.restore();
    },
};

export const Sparkline = memo(function Sparkline({
    id,
    width = 96,
    height = 24,
}) {
    const data = useSpark(id);
    const chartRef = useRef(null);
    const xMax = Math.max(0, data?.length - 1);

    const baseData = useMemo(
        () => ({
            datasets: [
                {
                    spark: "spark",
                    data,
                    borderWidth: 1.5,
                    borderColor: "#0b8615ff",
                    backgroundColor: "#0b861550",
                    pointRadius: 0,
                    fill: true,
                    tension: 0,
                },
            ],
        }),
        [data],
    );

    const baseOptions = useMemo(
        () => ({
            responsive: false,
            maintainAspectRatio: false,
            animation: false,
            events: [],
            parsing: false,
            normalized: true,
            plugins: {
                title: { display: false },
                legend: { display: false },
                tooltip: { enabled: false },
                chartAreaBorder: {
                    borderColor: "#0b8615ff",
                    borderWidth: 0.2,
                },
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    type: "linear",
                    display: false,
                    min: 0,
                    max: xMax,
                },
                y: { type: "linear", display: false },
            },
        }),
        [xMax],
    );

    const plugins = useMemo(() => [chartAreaBorder], []);

    return (
        <Line
            ref={chartRef}
            data={baseData}
            options={baseOptions}
            plugins={plugins}
            width={width}
            height={height}
            datasetIdKey={"spark"}
        />
    );
});
