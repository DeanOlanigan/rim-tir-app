import {
    addNodeCommand,
    duplicateNodesCommand,
    removeNodesCommand,
    reorderLayersCommand,
    updateNodeCommand,
    updateNodesCommand,
    updateNodesRafCommand,
} from "../commands";
import { pastePayloadCommand } from "../commands/clipboard/pastePayload.command";

export const createNodesSlice = (api) => {
    return {
        nodes: {},

        addNode: (node) => addNodeCommand(api, node),

        removeNode: (id) => removeNodesCommand(api, [id]),

        removeNodes: (ids) => removeNodesCommand(api, ids),

        updateNode: (id, nodePatch) => updateNodeCommand(api, id, nodePatch),

        updateNodesRaf: (patchesById) =>
            updateNodesRafCommand(api, patchesById),

        updateNodes: (patchesById) => updateNodesCommand(api, patchesById),

        reorderLayers: (ids, dir) => reorderLayersCommand(api, ids, dir),

        pastePayload: (payload, placement) =>
            pastePayloadCommand(api, payload, placement),

        duplicateNodes: (ids, opts) => duplicateNodesCommand(api, ids, opts),
    };
};
