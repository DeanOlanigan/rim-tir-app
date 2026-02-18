import { runCommand } from "../runCommand";
import { buildInsertPatch } from "./buildInsertPatch";

export const pastePayloadCommand = (api, payload, placement) => {
    runCommand(api, "cmd/clipboard/pasteNodes", (state) => {
        const res = buildInsertPatch(state, payload, placement);
        if (!res) return null;

        return {
            patch: res.patch,
            dirty: true,
            tree: true,
            selection: "set",
            selectedIds: res.insertedRootIds,
        };
    });
};
