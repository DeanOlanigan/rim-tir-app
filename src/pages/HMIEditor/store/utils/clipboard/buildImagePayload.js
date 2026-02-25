import {
    CLIPBOARD_TYPE,
    CLIPBOARD_TYPE_VERSION,
    SHAPES,
} from "@/pages/HMIEditor/constants";
import { round4 } from "@/pages/HMIEditor/utils";
import { nanoid } from "nanoid";

function clampPositive(n, fallback) {
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Возвращает viewport в world units.
 * Поддерживает два варианта входа:
 * 1) pasteCtx.viewportWorldWidth / viewportWorldHeight
 * 2) pasteCtx.viewportWidth / viewportHeight + pasteCtx.scale
 */
function getViewportWorldSize(pasteCtx) {
    const vw = pasteCtx?.viewportWorldWidth;
    const vh = pasteCtx?.viewportWorldHeight;
    if (Number.isFinite(vw) && vw > 0 && Number.isFinite(vh) && vh > 0) {
        return { width: vw, height: vh };
    }

    const pxW = pasteCtx?.viewportWidth;
    const pxH = pasteCtx?.viewportHeight;
    const scale = pasteCtx?.scale;

    if (
        Number.isFinite(pxW) &&
        pxW > 0 &&
        Number.isFinite(pxH) &&
        pxH > 0 &&
        Number.isFinite(scale) &&
        scale > 0
    ) {
        return {
            width: pxW / scale,
            height: pxH / scale,
        };
    }

    return null;
}

/**
 * Ограничение размера изображения по viewport.
 * fitRatio=0.75 => максимум 75% от видимой области.
 * Не увеличивает маленькие картинки (upscale=false).
 */
export function calcImageInsertSize(
    originalWidth,
    originalHeight,
    pasteCtx,
    opts = {},
) {
    const ow = clampPositive(originalWidth, 0);
    const oh = clampPositive(originalHeight, 0);
    if (!ow || !oh) return null;

    const fitRatio = clampPositive(opts.fitRatio, 0.75);
    const minSize = clampPositive(opts.minSize, 1);
    const upscale = !!opts.upscale; // обычно false

    const viewport = getViewportWorldSize(pasteCtx);

    // Fallback: если нет viewport-данных — просто исходный размер
    if (!viewport) {
        return {
            width: round4(Math.max(ow, minSize)),
            height: round4(Math.max(oh, minSize)),
        };
    }

    const maxW = Math.max(minSize, viewport.width * fitRatio);
    const maxH = Math.max(minSize, viewport.height * fitRatio);

    const sx = maxW / ow;
    const sy = maxH / oh;
    let scale = Math.min(sx, sy);

    if (!upscale) scale = Math.min(scale, 1);
    if (!Number.isFinite(scale) || scale <= 0) scale = 1;

    const width = Math.max(minSize, round4(ow * scale));
    const height = Math.max(minSize, round4(oh * scale));

    return { width, height };
}

/**
 * imageRef:
 * { assetId, width, height, mimeType, ... }
 *
 * pasteCtx:
 * { scale, viewportWidth/viewportHeight OR viewportWorldWidth/viewportWorldHeight, ... }
 */
export function buildClipboardPayloadFromImageAsset(
    imageRef,
    pasteCtx,
    opts = {},
) {
    if (!imageRef?.assetId) return null;
    if (!Number.isFinite(imageRef.width) || !Number.isFinite(imageRef.height)) {
        return null;
    }

    const fitted = calcImageInsertSize(
        imageRef.width,
        imageRef.height,
        pasteCtx,
        {
            fitRatio: opts.fitRatio ?? 0.75,
            minSize: opts.minSize ?? 1,
            upscale: opts.upscale ?? false,
        },
    );
    if (!fitted) return null;

    const id = nanoid(12);

    const imageNode = {
        id,
        parentId: null,
        fill: "rgba(195, 195, 195, 1)",
        stroke: "rgba(0, 0, 0, 1)",
        strokeWidth: 0,
        lineJoin: "miter",
        lineCap: "butt",
        dashEnabled: false,
        dash: [0, 0],
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        opacity: 1,
        visible: true,
        rotation: 0,
        bindings: {
            globalVarId: null,
            byProp: {},
        },
        events: {
            onClick: [],
            onContextMenu: [],
            onDoubleClick: [],
            onMouseDown: [],
            onMouseUp: [],
        },
        type: SHAPES.image,
        name: "Image",
        x: 0,
        y: 0,
        width: fitted.width,
        height: fitted.height,
        // ключевое:
        assetId: imageRef.assetId,
    };

    return {
        type: CLIPBOARD_TYPE,
        version: CLIPBOARD_TYPE_VERSION,
        nodes: {
            [id]: imageNode,
        },
        rootIds: [id],
    };
}
