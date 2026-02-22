import Konva from "konva";
import { getWorkAreaSize } from "@/pages/HMIEditor/utils";
import {
    SHAPES,
    THUMBNAIL_PADDING,
    THUMBNAIL_TARGET_HEIGHT,
    THUMBNAIL_TARGET_WIDTH,
} from "../constants";
import "../canvas/shapes/VariablePolygon";

function pick(obj, keys) {
    const out = {};
    for (const k of keys) if (obj?.[k] != null) out[k] = obj[k];
    return out;
}

// Общие поля, которые полезны почти всем фигурам
const COMMON_ATTRS = [
    "x",
    "y",
    "rotation",
    "scaleX",
    "scaleY",
    "skewX",
    "skewY",
    "opacity",
    "visible",
    "listening",
    "name",
];

// Стили/визуал
const STYLE_ATTRS = [
    "fill",
    "stroke",
    "strokeWidth",
    "dash",
    "dashOffset",
    "lineCap",
    "lineJoin",
    "shadowColor",
    "shadowBlur",
    "shadowOffsetX",
    "shadowOffsetY",
    "shadowOpacity",
];

// Для текста
const TEXT_ATTRS = [
    "text",
    "fontSize",
    "fontFamily",
    "fontStyle",
    "align",
    "verticalAlign",
    "padding",
    "lineHeight",
    "wrap",
    "ellipsis",
    "fill", // text fill
];

function ellipseToKonva(p) {
    const cx = p.x + p.width / 2;
    const cy = p.y + p.height / 2;
    return {
        x: cx,
        y: cy,
        radiusX: p.width / 2,
        radiusY: p.height / 2,
        rotation: p.rotation ?? 0,
    };
}

function createKonvaNodeFromState(node, nodesById) {
    if (!node) return null;

    const common = pick(node, COMMON_ATTRS);
    // На миниатюре слушатели не нужны
    common.listening = false;

    switch (node.type) {
        case SHAPES.rect: {
            // предполагаю что в сторе width/height
            const attrs = {
                ...common,
                ...pick(node, STYLE_ATTRS),
                width: node.width ?? 0,
                height: node.height ?? 0,
                cornerRadius: node.cornerRadius ?? 0,
            };
            return new Konva.Rect(attrs);
        }

        case SHAPES.ellipse: {
            const k = ellipseToKonva(node); // как у тебя в React-рендере
            const attrs = {
                ...common,
                ...pick(node, STYLE_ATTRS),
                x: k.x,
                y: k.y,
                radiusX: k.radiusX,
                radiusY: k.radiusY,
                rotation: k.rotation,
            };
            return new Konva.Ellipse(attrs);
        }

        case SHAPES.polygon: {
            const k = ellipseToKonva(node); // как у тебя в React-рендере
            const VP = Konva.VariablePolygon;
            if (!VP) return null;

            return new VP({
                ...common,
                ...pick(node, STYLE_ATTRS),
                x: k.x,
                y: k.y,
                radiusX: k.radiusX,
                radiusY: k.radiusY,
                rotation: k.rotation,
                sides: node.sides ?? 3,
                cornerRadius: node.cornerRadius ?? 0,
            });
        }

        case SHAPES.line: {
            const attrs = {
                ...common,
                ...pick(node, STYLE_ATTRS),
                points: node.points ?? [],
                // line-specific
                tension: node.tension,
                bezier: node.bezier,
            };
            return new Konva.Line(attrs);
        }

        case SHAPES.arrow: {
            const attrs = {
                ...common,
                ...pick(node, STYLE_ATTRS),
                points: node.points ?? [],
                pointerLength: node.pointerLength,
                pointerWidth: node.pointerWidth,
            };
            return new Konva.Arrow(attrs);
        }

        case SHAPES.text: {
            const attrs = {
                ...common,
                ...pick(node, TEXT_ATTRS),
                width: node.width,
                height: node.height,
            };
            return new Konva.Text(attrs);
        }

        case SHAPES.group: {
            const grp = new Konva.Group({
                ...common,
            });

            const children = node.childrenIds ?? [];
            for (const childId of children) {
                const child = nodesById[childId];
                const childKonva = createKonvaNodeFromState(child, nodesById);
                if (childKonva) grp.add(childKonva);
            }
            return grp;
        }

        default:
            return null;
    }
}

export async function renderPageToBlobOffscreen({ state, pageId }) {
    const page = state.pages?.[pageId];
    if (!page) return null;

    const bgColor = page.backgroundColor;

    const rootIds = page.rootIds ?? [];
    if (rootIds.length === 0) return null;

    // 1) делаем контейнер для offscreen stage
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-99999px";
    container.style.top = "-99999px";
    container.style.width = `${THUMBNAIL_TARGET_WIDTH}px`;
    container.style.height = `${THUMBNAIL_TARGET_HEIGHT}px`;
    container.style.pointerEvents = "none";
    container.style.opacity = "0";
    document.body.appendChild(container);

    const stage = new Konva.Stage({
        container,
        width: THUMBNAIL_TARGET_WIDTH,
        height: THUMBNAIL_TARGET_HEIGHT,
    });

    const layer = new Konva.Layer({ listening: false });
    stage.add(layer);

    // 1) add shapes (no bg)
    const renderedNodes = [];
    for (const id of rootIds) {
        const node = state.nodes?.[id];
        const kn = createKonvaNodeFromState(node, state.nodes);
        if (kn) {
            layer.add(kn);
            renderedNodes.push(kn);
        }
    }

    layer.draw();

    // 2) workArea like your getWorkAreaSize
    const workArea = getWorkAreaSize({ konvaNodes: renderedNodes });
    if (!workArea) {
        stage.destroy();
        container.remove();
        return null;
    }

    const bgRect = new Konva.Rect({
        x: workArea.x - 1000,
        y: workArea.y - 1000,
        width: workArea.width + 2000,
        height: workArea.height + 2000,
        fill: bgColor ?? "#fff",
        listening: false,
    });
    layer.add(bgRect);
    bgRect.moveToBottom();

    const contentWidth = THUMBNAIL_TARGET_WIDTH - THUMBNAIL_PADDING * 2;
    const contentHeight = THUMBNAIL_TARGET_HEIGHT - THUMBNAIL_PADDING * 2;

    const scale = Math.min(
        contentWidth / workArea.width,
        contentHeight / workArea.height,
    );

    const scaledW = workArea.width * scale;
    const scaledH = workArea.height * scale;

    const offsetX = (THUMBNAIL_TARGET_WIDTH - scaledW) / 2;
    const offsetY = (THUMBNAIL_TARGET_HEIGHT - scaledH) / 2;

    const oldScale = stage.scale();
    const oldPos = stage.position();

    stage.scale({ x: scale, y: scale });
    stage.position({
        x: offsetX - workArea.x * scale,
        y: offsetY - workArea.y * scale,
    });

    layer.draw();

    // 6) toBlob
    const blob = await new Promise((resolve) => {
        stage.toBlob({
            callback: (b) => resolve(b ?? null),
            x: 0,
            y: 0,
            width: THUMBNAIL_TARGET_WIDTH,
            height: THUMBNAIL_TARGET_HEIGHT,
            pixelRatio: 1,
            mimeType: "image/png",
            quality: 0.8,
        });
    });

    // restore + cleanup
    stage.scale(oldScale);
    stage.position(oldPos);
    stage.destroy();
    container.remove();

    return blob;
}
