import { Shape } from "react-konva";
import { useActionsStore } from "../store/actions-store";

export const Grid = ({
    frame,
    gridSize = 10,
    color = "#ddd",
    opacity = 0.3,
    majorEvery = 5,
    stageRef,
}) => {
    const showGrid = useActionsStore((state) => state.showGrid);

    return (
        showGrid && (
            <Shape
                x={frame.x}
                y={frame.y}
                perfectDrawEnabled={false}
                shadowForStrokeEnabled={false}
                listening={false}
                sceneFunc={(ctx) => {
                    const stage = stageRef.current;
                    if (!stage) return;

                    const scale = stage.scaleX();
                    const sx = stage.x();
                    const sy = stage.y();

                    const step = gridSize * scale;
                    if (step <= 10) return;

                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);

                    let clipX = 0,
                        clipY = 0,
                        clipW = 0,
                        clipH = 0;
                    if (frame) {
                        clipX = sx + frame.x * scale;
                        clipY = sy + frame.y * scale;
                        clipW = frame.width * scale;
                        clipH = frame.height * scale;

                        ctx.beginPath();
                        ctx.rect(clipX, clipY, clipW, clipH);
                        ctx.clip();
                    }
                    const xMin = clipX,
                        xMax = clipX + clipW;
                    const yMin = clipY,
                        yMax = clipY + clipH;

                    //ctx.clearRect(0, 0, vw, vh);
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = opacity;
                    ctx.lineWidth = 1;

                    const nStartX = Math.ceil((xMin - sx) / step);
                    const nStartY = Math.ceil((yMin - sy) / step);
                    ctx.beginPath();
                    for (
                        let xLine = sx + nStartX * step;
                        xLine <= xMax;
                        xLine += step
                    ) {
                        const px = Math.round(xLine) + 0.5;
                        ctx.moveTo(px, yMin);
                        ctx.lineTo(px, yMax);
                    }
                    for (
                        let yLine = sy + nStartY * step;
                        yLine <= yMax;
                        yLine += step
                    ) {
                        const py = Math.round(yLine) + 0.5;
                        ctx.moveTo(xMin, py);
                        ctx.lineTo(xMax, py);
                    }
                    ctx.stroke();

                    const majorStep = step * majorEvery;
                    ctx.globalAlpha = Math.min(opacity + 0.3, 0.75);

                    const nStartXMajor = Math.ceil((xMin - sx) / majorStep);
                    const nStartYMajor = Math.ceil((yMin - sy) / majorStep);
                    ctx.beginPath();
                    for (
                        let xLine = sx + nStartXMajor * majorStep;
                        xLine <= xMax;
                        xLine += majorStep
                    ) {
                        const px = Math.round(xLine) + 0.5;
                        ctx.moveTo(px, yMin);
                        ctx.lineTo(px, yMax);
                    }
                    for (
                        let yLine = sy + nStartYMajor * majorStep;
                        yLine <= yMax;
                        yLine += majorStep
                    ) {
                        const py = Math.round(yLine) + 0.5;
                        ctx.moveTo(xMin, py);
                        ctx.lineTo(xMax, py);
                    }
                    ctx.stroke();

                    ctx.restore();
                }}
            />
        )
    );
};
