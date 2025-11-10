import { createDrawRectTool } from "./drawRect";
import { createHandTool } from "./hand";
import { createSelectTool } from "./select";

export function createToolsRegistry(deps) {
    return {
        select: createSelectTool(deps),
        hand: createHandTool(deps),
        square: createDrawRectTool(deps),
    };
}
