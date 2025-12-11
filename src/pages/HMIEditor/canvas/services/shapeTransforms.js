import { round4 } from "../../utils";

export function rotateNodeAroundCenter(api, id, angle) {
    const node = api.canvas.getNodes().get(id);
    if (!node) return;
    const stage = api.canvas.getStage();
    const { x, y } = applyCenteredTransform(node, stage, () => {
        node.rotation(angle);
    });
    return { x, y, rotation: angle };
}

function applyCenteredTransform(node, stage, transformFn) {
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

    return { x: newPosX, y: newPosY };
}

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
