import { nanoid } from "nanoid";

export function rehydrateClipboardNodes(nodes) {
    const idMap = {};
    const newNodes = {};

    Object.keys(nodes).forEach((oldId) => {
        idMap[oldId] = nanoid(12);
    });

    Object.values(nodes).forEach((node) => {
        const newId = idMap[node.id];
        const cloned = structuredClone(node);

        cloned.id = newId;
        if (cloned.childrenIds) {
            cloned.childrenIds = cloned.childrenIds.map((id) => idMap[id]);
        }

        if (cloned.bindings) {
            cloned.bindings.globalVarId = null;

            cloned.bindings.items?.forEach((b) => {
                b.id = nanoid(12);
                b.varId = null;

                b.rules?.forEach((r) => {
                    r.id = nanoid(12);
                });
            });
        }

        if (cloned.events) {
            Object.values(cloned.events).forEach((eventList) => {
                eventList?.forEach((action) => {
                    action.id = nanoid(12);

                    if (action.options?.varId) {
                        action.options.varId = null;
                    }
                });
            });
        }

        newNodes[newId] = cloned;
    });

    return { newNodes, idMap };
}
