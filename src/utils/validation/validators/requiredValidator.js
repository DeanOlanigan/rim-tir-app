import { VALIDATOR } from "../const";
import { setDraftMessage } from "../validator";

export function requiredValidator({ nodeId, param, rule, context, draft }) {
    const val = context[nodeId]?.setting?.[param];
    const res =
        val !== undefined && val !== null && val !== "" && val !== false;
    setDraftMessage(
        draft,
        nodeId,
        param,
        VALIDATOR.REQUIRED,
        res ? [] : [rule.message || "Обязательное поле"]
    );
}
