import { VALIDATOR } from "../const";
import { setDraftMessage } from "../validator";

export function rangeValidator({ nodeId, param, rule, context, draft }) {
    const { min, max } = rule.params || {};
    const val = context[nodeId]?.setting?.[param];
    const res =
        (min != null ? val >= min : true) && (max != null ? val <= max : true);
    setDraftMessage(
        draft,
        nodeId,
        param,
        VALIDATOR.RANGE,
        res ? [] : [rule.message || `Value must be between ${min} and ${max}`]
    );
}
