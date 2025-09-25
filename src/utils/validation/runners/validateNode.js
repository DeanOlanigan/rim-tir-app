import { ErrorDraft } from "../core/ErrorDraft";
import { validateParameter } from "./validateParameter";

export function validateNode(
    node,
    settings,
    configuratorConfig,
    draft = new ErrorDraft()
) {
    if (!node.setting) return;
    for (const paramKey of Object.keys(node.setting)) {
        validateParameter(
            node.id,
            paramKey,
            settings,
            configuratorConfig,
            draft
        );
    }
}
