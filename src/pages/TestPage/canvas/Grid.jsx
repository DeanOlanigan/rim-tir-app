import { Shape } from "react-konva";

export const Grid = ({
    x,
    y,
    width,
    height,
    gridSize = 10,
    color = "#ddd",
    opacity = 0.3,
    majorEvery = 5,
    stageRef,
}) => {
    return (
        <Shape
            x={x}
            y={y}
            perfectDrawEnabled={false}
            shadowForStrokeEnabled={false}
            listening={false}
            sceneFunc={(ctx) => {
                const stage = stageRef.current;
                if (!stage) return;

                const vw = width;
                const vh = height;

                const scale = stage.scaleX();
                const pos = stage.position();

                const step = gridSize * scale;
                const startX = -((pos.x * scale) % step);
                const startY = -((pos.y * scale) % step);

                ctx.save();
                //ctx.clearRect(0, 0, vw, vh);

                ctx.strokeStyle = color;
                ctx.globalAlpha = opacity;
                ctx.lineWidth = 1;

                ctx.beginPath();
                for (let x = startX; x <= vw; x += step) {
                    const px = Math.round(x) + 0.5;
                    ctx.moveTo(px, 0);
                    ctx.lineTo(px, vh);
                }
                for (let y = startY; y <= vh; y += step) {
                    const py = Math.round(y) + 0.5;
                    ctx.moveTo(0, py);
                    ctx.lineTo(vw, py);
                }
                ctx.stroke();

                const majorStep = step * majorEvery;
                ctx.globalAlpha = Math.min(opacity + 0.3, 0.75);

                ctx.beginPath();
                for (let x = startX; x <= vw; x += majorStep) {
                    const px = Math.round(x) + 0.5;
                    ctx.moveTo(px, 0);
                    ctx.lineTo(px, vh);
                }
                for (let y = startY; y <= vh; y += majorStep) {
                    const py = Math.round(y) + 0.5;
                    ctx.moveTo(0, py);
                    ctx.lineTo(vw, py);
                }
                ctx.stroke();

                ctx.restore();
            }}
        />
    );
};
