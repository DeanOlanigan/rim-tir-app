import { buildIndexesFromNodes } from "../../utils/bindings";
import { runCommand } from "../runCommand";

export const rebuildIndexCommand = (api) => {
    runCommand(api, "cmd/bind/rebuildIndex", (state) => {
        const patch = buildIndexesFromNodes(state.nodes);
        return {
            patch,
        };
    });
};
