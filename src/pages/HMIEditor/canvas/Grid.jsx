import { Shape } from "react-konva";
import { useActionsStore } from "../store/actions-store";
import { GRID_MAJOR_STEP, GRID_OPACITY } from "../constants";

export const Grid = ({ width, height, gridSize = 10, stageRef }) => {
    const showGrid = useActionsStore((state) => state.showGrid);
    const gridColor = useActionsStore((state) => state.gridColor);

    return (
        showGrid && (
            <Shape
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

                    const clipX = sx + 0 * scale;
                    const clipY = sy + 0 * scale;
                    const clipW = width * scale;
                    const clipH = height * scale;

                    ctx.beginPath();
                    ctx.rect(clipX, clipY, clipW, clipH);
                    ctx.clip();

                    const xMin = clipX;
                    const xMax = clipX + clipW;
                    const yMin = clipY;
                    const yMax = clipY + clipH;

                    //ctx.clearRect(0, 0, vw, vh);
                    ctx.strokeStyle = gridColor;
                    ctx.globalAlpha = GRID_OPACITY;
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

                    const majorStep = step * GRID_MAJOR_STEP;
                    ctx.globalAlpha = Math.min(GRID_OPACITY + 0.3, 0.75);

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
