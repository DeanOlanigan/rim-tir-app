import { SHAPES } from "@/pages/HMIEditor/constants";
import { pruneNestedSelection } from "./pruneNestedSelection";

/**
 * Фильтрует ID, оставляя только существующие группы
 */
export function getValidGroupIds(ids, nodes) {
    const pruned = pruneNestedSelection(ids, nodes);
    return pruned.filter((id) => nodes[id]?.type === SHAPES.group);
}
