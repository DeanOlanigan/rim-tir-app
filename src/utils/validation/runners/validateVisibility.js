import { checkDependencies } from "../engines/jsonlogic/jsonLogic";

export function validateVisibility(visibleIf, nodeId, settings) {
    return checkDependencies(visibleIf, settings, nodeId);
}
