import { collectAllDescendants } from "../nodes/collectAllDescendants";

export function getPageNodeIds(nodes, page) {
    const nodesToDelete = [];
    page.rootIds.forEach((id) =>
        collectAllDescendants(id, nodes, nodesToDelete),
    );
    return nodesToDelete;
}
