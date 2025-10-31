import { ErrorDraft } from "../core/ErrorDraft";
import { validateName } from "./validateName";
import { validateParameter } from "./validateParameter";

export function validateNode({
    node,
    settings,
    configuratorConfig,
    draft = new ErrorDraft(),
}) {
    validateName({
        id: node.id,
        settings,
        draft,
    });
    if (!node.setting) return;
    for (const paramKey of Object.keys(node.setting)) {
        validateParameter({
            id: node.id,
            param: paramKey,
            settings,
            cfg: configuratorConfig,
            draft,
        });
    }
}
