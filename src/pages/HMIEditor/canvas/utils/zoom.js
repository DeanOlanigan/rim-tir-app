import {
    DEFAULT_MAX_ZOOM,
    DEFAULT_MIN_ZOOM,
    FIT_PADDING,
    ZOOM_PERCENTAGE_STEP,
} from "../../constants";
import { round4 } from "./coords";
import { clamp } from "./geom";

const zoomAt = (stage, nextScale, anchorPoint) => {
    const oldScale = stage.scaleX();

    const pointer = anchorPoint ?? {
        x: stage.width() / 2,
        y: stage.height() / 2,
    };

    const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    stage.scale({ x: nextScale, y: nextScale });

    const newPos = {
        x: pointer.x - mousePointTo.x * nextScale,
        y: pointer.y - mousePointTo.y * nextScale,
    };
    stage.position(newPos);
};

export function zoomTo(stage, nextScale, pointer) {
    zoomAt(stage, nextScale, pointer);
    return nextScale;
}

export function zoomPercent(stage, dir, pointer) {
    const oldScale = stage.scaleX();
    const zoomFactor = 1 + dir * ZOOM_PERCENTAGE_STEP;
    const nextScale = round4(
        clamp(oldScale * zoomFactor, DEFAULT_MIN_ZOOM, DEFAULT_MAX_ZOOM)
    );
    zoomAt(stage, nextScale, pointer);
    return nextScale;
}

export function calcFitScale(workspaceW, workspaceH, viewportW, viewportH) {
    if (!workspaceW || !workspaceH || !viewportW || !viewportH) return 1;
    const scale = Math.min(
        (viewportW / workspaceW) * FIT_PADDING,
        (viewportH / workspaceH) * FIT_PADDING
    );
    return round4(clamp(scale, DEFAULT_MIN_ZOOM, DEFAULT_MAX_ZOOM));
}

export function fitStageToWork(
    stage,
    workspaceW,
    workspaceH,
    viewportW,
    viewportH
) {
    const scale = calcFitScale(workspaceW, workspaceH, viewportW, viewportH);
    stage.scale({ x: scale, y: scale });
    const x = (viewportW - workspaceW * scale) / 2;
    const y = (viewportH - workspaceH * scale) / 2;
    stage.position({ x: x || 0, y: y || 0 });
    return scale;
}

export function getWorkAreaAnchor(stage, workspaceW, workspaceH) {
    const scale = stage.scaleX();
    const wordCx = workspaceW / 2;
    const wordCy = workspaceH / 2;

    const x = wordCx * scale + stage.x();
    const y = wordCy * scale + stage.y();

    return { x, y };
}

export function getClampedWorkAreaAnchor(stage, workspaceW, workspaceH) {
    const raw = getWorkAreaAnchor(stage, workspaceW, workspaceH);
    return {
        x: Math.min(Math.max(raw.x, 0), stage.width()),
        y: Math.min(Math.max(raw.y, 0), stage.height()),
    };
}
