import { SHAPES } from "@/pages/HMIEditor/constants";
import { getNodeLocalTransformMatrix } from "@/pages/HMIEditor/utils/getNodeLocalTransformMatrix";
import { calculateContentBounds } from "../geometry/calculateContentBounds";
import { getNodeParentLocalAABB } from "../geometry/aabb";

const EPS = 1e-6;
const near0 = (v) => Math.abs(v) < EPS;

export function recalcGroupBBoxDraft(nodes, groupId) {
    const g = nodes[groupId];
    if (!g || g.type !== SHAPES.group) return false;

    const kids = g.childrenIds ?? [];
    if (kids.length === 0) {
        return handleEmptyGroup(nodes, g);
    }

    const bounds = calculateContentBounds(nodes, kids, (_id, node) =>
        getNodeParentLocalAABB(node),
    );
    if (!bounds) return false;

    const geometry = calculateNewGroupGeometry(g, bounds);
    const { newGroupNode, shift, hasChanges } = geometry;

    if (!hasChanges) return false;

    // COW: клонируем nodes только если реально меняем
    //let newNodes = { ...nodes, [groupId]: newGroupNode };

    nodes[groupId] = newGroupNode;

    if (shift.dx !== 0 || shift.dy !== 0) {
        shiftChildren(nodes, kids, shift.dx, shift.dy);
    }

    return true;
}

/**
 * Сброс размеров пустой группы (если нужно по политике)
 */
function handleEmptyGroup(nodes, groupNode) {
    // Политика на твой вкус:
    // 1) оставить как есть
    // 2) обнулить w/h
    const w = groupNode.width ?? 0;
    const h = groupNode.height ?? 0;

    if (near0(w) && near0(h)) return false;

    nodes[groupNode.id] = { ...groupNode, width: 0, height: 0 };
    return true;
}

/**
 * Вычисляет новый объект группы и необходимый сдвиг детей
 */
function calculateNewGroupGeometry(groupNode, bounds) {
    let dx = bounds.minX;
    let dy = bounds.minY;

    if (near0(dx)) dx = 0;
    if (near0(dy)) dy = 0;

    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    const M = getNodeLocalTransformMatrix(groupNode);
    const dv = { x: M.a * dx + M.c * dy, y: M.b * dx + M.d * dy };

    const newGroupNode = {
        ...groupNode,
        x: (groupNode.x ?? 0) + dv.x,
        y: (groupNode.y ?? 0) + dv.y,
        width,
        height,
    };

    // Проверка на изменения
    // Если dx=dy=0 и размер не изменился — можно не трогать
    const sizeChanged =
        Math.abs((groupNode.width ?? 0) - width) >= EPS ||
        Math.abs((groupNode.height ?? 0) - height) >= EPS;

    const posChanged = dx !== 0 || dy !== 0;

    return {
        newGroupNode,
        shift: { dx, dy },
        hasChanges: sizeChanged || posChanged,
    };
}

/**
 * Обновляет координаты детей, сдвигая их на -dx, -dy
 */
function shiftChildren(nodes, childIds, dx, dy) {
    // Работаем с уже клонированным объектом nodes (или клонируем здесь, если нужно строже)
    const out = nodes;

    for (const childId of childIds) {
        const child = out[childId];
        if (!child) continue;

        const nx = (child.x ?? 0) - dx;
        const ny = (child.y ?? 0) - dy;

        // Оптимизация: не обновлять, если разница мизерная
        if (
            Math.abs((child.x ?? 0) - nx) < EPS &&
            Math.abs((child.y ?? 0) - ny) < EPS
        ) {
            continue;
        }

        out[childId] = { ...child, x: nx, y: ny };
    }

    return out;
}
