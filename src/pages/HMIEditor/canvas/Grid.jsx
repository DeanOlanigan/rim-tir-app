import { Shape } from "react-konva";
import { useActionsStore } from "../store/actions-store";
import { GRID_MAJOR_STEP, GRID_OPACITY } from "../constants";
import { useCallback } from "react";

function drawGrid({ ctx, shape, gridSize, gridColor, clipSize }) {
    const stage = shape.getStage();
    if (!stage) return;

    const vw = stage.width();
    const vh = stage.height();
    const scale = stage.scaleX();
    const sx = stage.x();
    const sy = stage.y();

    const step = gridSize * scale;
    if (step <= 10) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    let clipX = 0,
        clipY = 0,
        clipW = vw,
        clipH = vh;
    if (clipSize) {
        clipX = sx;
        clipY = sy;

        clipW = clipSize.width * scale;
        clipH = clipSize.height * scale;
        ctx.beginPath();
        ctx.rect(clipX, clipY, clipW, clipH);
        ctx.clip();
    }

    const xMin = clipX;
    const xMax = clipX + clipW;
    const yMin = clipY;
    const yMax = clipY + clipH;

    ctx.strokeStyle = gridColor;
    ctx.globalAlpha = GRID_OPACITY;
    ctx.lineWidth = 1;

    // main grid lines
    const nStartX = Math.ceil((xMin - sx) / step);
    const nStartY = Math.ceil((yMin - sy) / step);
    ctx.beginPath();
    for (let xLine = sx + nStartX * step; xLine <= xMax; xLine += step) {
        const px = Math.round(xLine) + 0.5;
        ctx.moveTo(px, yMin);
        ctx.lineTo(px, yMax);
    }
    for (let yLine = sy + nStartY * step; yLine <= yMax; yLine += step) {
        const py = Math.round(yLine) + 0.5;
        ctx.moveTo(xMin, py);
        ctx.lineTo(xMax, py);
    }
    ctx.stroke();

    // major grid lines
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
}

export const Grid = ({ clipSize }) => {
    const gridSize = useActionsStore((state) => state.gridSize);
    const showGrid = useActionsStore((state) => state.showGrid);
    const gridColor = useActionsStore((state) => state.gridColor);

    const sceneFunc = useCallback(
        (ctx, shape) => {
            drawGrid({ ctx, shape, gridSize, gridColor, clipSize });
        },
        [gridSize, gridColor, clipSize]
    );

    return (
        showGrid && (
            <Shape
                perfectDrawEnabled={false}
                shadowForStrokeEnabled={false}
                listening={false}
                sceneFunc={sceneFunc}
            />
        )
    );
};
