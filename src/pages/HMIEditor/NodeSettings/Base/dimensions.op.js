import {
    getEffectiveNode,
    useInteractiveStore,
} from "../../store/interactive-store";
import { useNodeStore } from "../../store/node-store";
import { isLineLikeType, round4 } from "../../utils";

export function getPointsBounds(points) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < points.length; i += 2) {
        const x = points[i];
        const y = points[i + 1];

        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    }

    if (!Number.isFinite(minX)) {
        return { minX: 0, minY: 0, width: 0, height: 0 };
    }

    return {
        minX,
        minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

const MIN_SIZE = 1e-3;

function clampSize(v) {
    if (!Number.isFinite(v)) return MIN_SIZE;
    return Math.max(MIN_SIZE, Math.abs(v));
}

/**
 * Чистая функция от id (читает node из стора), возвращает patch для line/arrow.
 * x/y не трогаем — якорь (первая точка) остается на месте.
 */
export function changeLineDimByStore(id, dimType, aspectRatio, rawVal) {
    const node = getEffectiveNode(id);
    if (!node || !Array.isArray(node.points)) return null;

    const bounds = getPointsBounds(node.points);
    const curWidth = Math.max(MIN_SIZE, bounds.width || 0);
    const curHeight = Math.max(MIN_SIZE, bounds.height || 0);

    const input = Number.isFinite(rawVal) ? rawVal : 0;
    const val = clampSize(input);

    let targetWidth = curWidth;
    let targetHeight = curHeight;

    if (aspectRatio) {
        if (dimType === "width") {
            const scale = val / curWidth;
            targetWidth = val;
            targetHeight = clampSize(curHeight * scale);
        } else {
            const scale = val / curHeight;
            targetHeight = val;
            targetWidth = clampSize(curWidth * scale);
        }
    } else {
        if (dimType === "width") targetWidth = val;
        if (dimType === "height") targetHeight = val;
    }

    return resizeLineLikeNode(node, targetWidth, targetHeight);
}

/**
 * Чистая функция: принимает node из стора, возвращает patch без мутаций Konva.
 */
export function resizeLineLikeNode(node, targetWidth, targetHeight) {
    if (!node || !Array.isArray(node.points)) return null;

    const bounds = getPointsBounds(node.points);
    const curWidth = Math.max(MIN_SIZE, bounds.width || 0);
    const curHeight = Math.max(MIN_SIZE, bounds.height || 0);

    const nextWidth = clampSize(targetWidth);
    const nextHeight = clampSize(targetHeight);

    const sx = nextWidth / curWidth;
    const sy = nextHeight / curHeight;

    const newPoints = scaleLinePointsFromBounds(node.points, bounds, sx, sy);

    return {
        points: newPoints,
        width: round4(nextWidth),
        height: round4(nextHeight),
    };
}

/**
 * Масштабирование points относительно bbox (minX/minY).
 * Это безопаснее, чем умножать от (0,0), если вдруг points неидеально нормализованы.
 */
export function scaleLinePointsFromBounds(points, bounds, sx, sy) {
    const { minX, minY } = bounds;
    const out = new Array(points.length);

    for (let i = 0; i < points.length; i += 2) {
        const px = points[i];
        const py = points[i + 1];

        out[i] = round4(minX + (px - minX) * sx);
        out[i + 1] = round4(minY + (py - minY) * sy);
    }

    return out;
}

export function collectSelectionDimensions(ids, getType, widths, heights) {
    let width;
    let height;

    const same = (prev, next) => {
        if (prev === undefined) return next;
        return Math.abs(prev - next) < 0.5 ? prev : NaN;
    };

    ids.forEach((id, index) => {
        const type = getType(id);

        let w;
        let h;

        if (isLineLikeType(type)) {
            const base = useNodeStore.getState().nodes[id];
            const overlayPoints =
                useInteractiveStore.getState().patchesById[id]?.points;
            const points = overlayPoints ?? base?.points;
            if (!points || !Array.isArray(points)) return;

            const rect = getPointsBounds(points);
            w = rect.width;
            h = rect.height;
        } else {
            w = widths[index];
            h = heights[index];
        }

        width = width === undefined ? w : same(width, w);
        height = height === undefined ? h : same(height, h);
    });

    return {
        width: width === undefined || Number.isNaN(width) ? "" : width,
        height: height === undefined || Number.isNaN(height) ? "" : height,
    };
}
