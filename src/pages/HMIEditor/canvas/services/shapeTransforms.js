import { round4 } from "../../utils";

export function rotateNodeAroundCenter(api, id, angle, sizeFromStore) {
    const node = api.canvas.getNodes().get(id);
    if (!node) return;
    /* const stage = api.canvas.getStage();
    const { x, y } = applyCenteredTransform(node, stage, () =>
        node.rotation(angle),
    );

    return { x, y, rotation: angle }; */

    return rotateNodeForStore(node, angle, { size: sizeFromStore });
}

/* function applyCenteredTransform(node, stage, transformFn) {
    const isEllipse = isHasRadius(node.attrs.type);
    // центр до трансформации
    const oldRect = node.getClientRect({ relativeTo: stage });
    const oldCenter = {
        x: oldRect.x + oldRect.width / 2,
        y: oldRect.y + oldRect.height / 2,
    };
    // сама трансформация (rotation / flip / что угодно)
    transformFn();
    // центр после трансформации
    const newRect = node.getClientRect({ relativeTo: stage });
    const newCenter = {
        x: newRect.x + newRect.width / 2,
        y: newRect.y + newRect.height / 2,
    };
    // сдвигаем ноду так, чтобы визуальный центр остался на месте
    const dx = oldCenter.x - newCenter.x;
    const dy = oldCenter.y - newCenter.y;
    const newPosX = round4(node.x() + dx);
    const newPosY = round4(node.y() + dy);

    node.position({ x: newPosX, y: newPosY });

    const pos = {
        x: isEllipse ? newPosX - newRect.width / 2 : newPosX,
        y: isEllipse ? newPosY - newRect.height / 2 : newPosY,
    };

    return pos;
} */

export function getLineRect(api, id) {
    const node = api.canvas.getNodes().get(id);
    if (!node) return;
    return node.getSelfRect();
}

export function resizeLineLike(api, id, targetWidth, targetHeight) {
    const node = api.canvas.getNodes().get(id);
    if (!node) return;

    const rect = node.getSelfRect();
    const curWidth = rect.width || 1;
    const curHeight = rect.height || 1;

    const sx = targetWidth / curWidth;
    const sy = targetHeight / curHeight;

    const oldPoints = node.points();
    const newPoints = [];

    for (let i = 0; i < oldPoints.length; i += 2) {
        const px = oldPoints[i];
        const py = oldPoints[i + 1];

        const relX = px - rect.x;
        const relY = py - rect.y;

        const scaleX = round4(rect.x + relX * sx);
        const scaleY = round4(rect.y + relY * sy);

        newPoints.push(scaleX, scaleY);
    }
    node.points(newPoints);
    return {
        points: newPoints,
        width: targetWidth,
        height: targetHeight,
    };
}

export function changeLineDim(api, id, type, aspectRatio, val) {
    const rect = getLineRect(api, id);
    if (!rect) return;

    const curWidth = rect.width || 1;
    const curHeight = rect.height || 1;

    let targetWidth = curWidth;
    let targetHeight = curHeight;

    if (aspectRatio) {
        if (type === "width") {
            const scale = val / curWidth;
            targetWidth = val;
            targetHeight = curHeight * scale;
        } else {
            const scale = val / curHeight;
            targetWidth = curWidth * scale;
            targetHeight = val;
        }
    } else {
        if (type === "width") targetWidth = val;
        if (type === "height") targetHeight = val;
    }

    return resizeLineLike(api, id, targetWidth, targetHeight);
}

const EPS = 1e-9;

function getNodeGeomSize(node, sizeOverride) {
    if (sizeOverride.width !== null && sizeOverride.height !== null) {
        return { width: sizeOverride.width, height: sizeOverride.height };
    }

    if (
        typeof node.radiusX === "function" &&
        typeof node.radiusY === "function"
    ) {
        return {
            width: node.radiusX() * 2,
            height: node.radiusY() * 2,
        };
    }

    if (typeof node.width === "function" && typeof node.height === "function") {
        return {
            width: node.width(),
            height: node.height(),
        };
    }

    return { width: 0, height: 0 };
}

function rotateKeepAnchor(node, angle, opts = {}) {
    if (!node) return { absDx: 0, absDy: 0 };

    const anchor = opts.anchor ?? "center";
    const { width, height } = getNodeGeomSize(node, opts.size);

    let localAnchor;

    const isEllipse =
        typeof node.radiusX === "function" &&
        typeof node.radiusY === "function";

    if (anchor === "pos") {
        localAnchor = { x: 0, y: 0 };
    } else {
        if (isEllipse) {
            localAnchor = { x: 0, y: 0 };
        } else {
            localAnchor = { x: width / 2, y: height / 2 };
        }
    }

    const t1 = node.getAbsoluteTransform();
    const absBefore = t1.point(localAnchor);

    node.rotation(angle);

    const t2 = node.getAbsoluteTransform();
    const absAfter = t2.point(localAnchor);

    const dx = absBefore.x - absAfter.x;
    const dy = absBefore.y - absAfter.y;

    if (Math.abs(dx) > EPS || Math.abs(dy) > EPS) {
        const ap = node.absolutePosition();
        node.absolutePosition({ x: ap.x + dx, y: ap.y + dy });
    }

    return { absDx: dx, absDy: dy };
}

function rotateNodeForStore(node, angle, opts = {}) {
    rotateKeepAnchor(node, angle, { anchor: "center", size: opts.size });

    const { width, height } = getNodeGeomSize(node, opts.size);

    const isEllipse =
        typeof node.radiusX === "function" &&
        typeof node.radiusY === "function";

    if (isEllipse) {
        return {
            x: round4(node.x() - width / 2),
            y: round4(node.y() - height / 2),
            rotation: round4(node.rotation()),
        };
    }

    return {
        x: round4(node.x()),
        y: round4(node.y()),
        rotation: round4(node.rotation()),
    };
}
