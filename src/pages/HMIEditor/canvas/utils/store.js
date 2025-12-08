import { getShape } from "../shapes";

// not used
export const updateStoreNode = (node, updateNode) => {
    const { id, type } = node.attrs;
    const shape = getShape(type);

    if (!shape || typeof shape.toModelFromKonva !== "function") {
        console.warn("No shape adapter for type:", type);
        return;
    }

    const patch = shape.toModelFromKonva(node);

    updateNode(id, patch);
};
