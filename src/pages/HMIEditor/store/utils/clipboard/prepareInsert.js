import { calcGroupAABBCenter } from "@/pages/HMIEditor/utils";
import { placeNodesAtPoint } from "./placeNodesAtPoint";
import { rehydrateClipboardNodes } from "./rehydrateClipboardNodes";

/**
 *
 * @param {*} payload { type, version, nodes, rootIds }
 * @param {*} placement { kind: "point", x, y, gridSize } | { kind: "offset", dx, dy, gridSize }
 * @returns {object} { newNodes, newRootIds }
 */
export function prepareInsertFromPayload(payload, placement) {
    if (!payload?.nodes || !payload?.rootIds?.length) return null;

    const { newNodes, idMap } = rehydrateClipboardNodes(payload.nodes);
    const newRootIds = payload.rootIds.map((id) => idMap[id]).filter(Boolean);
    if (!newRootIds.length) return null;

    const gridSize = placement?.gridSize ?? 1;

    if (placement?.kind === "point") {
        placeNodesAtPoint({
            nodes: newNodes,
            rootIds: newRootIds,
            x: placement.x,
            y: placement.y,
            gridSize,
        });
    } else if (placement?.kind === "offset") {
        // Дубликат обычно смещаем от исходного положения, а не в точку курсора.
        // Используем pivot новых root-узлов (они изначально на тех же координатах),
        // и применяем placeNodesAtPoint к pivot+offset — так снап работает “группой”.
        const rootNodes = newRootIds.map((id) => newNodes[id]).filter(Boolean);
        if (rootNodes.length) {
            const pivot = calcGroupAABBCenter(rootNodes);
            placeNodesAtPoint({
                nodes: newNodes,
                rootIds: newRootIds,
                x: pivot.x + (placement.dx ?? 0),
                y: pivot.y + (placement.dy ?? 0),
                gridSize,
            });
        }
    }

    return { nodesToInsert: newNodes, rootIdsToInsert: newRootIds };
}
