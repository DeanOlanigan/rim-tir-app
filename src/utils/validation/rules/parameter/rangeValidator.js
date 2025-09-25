import { VALIDATOR } from "../../utils/const";

export function rangeValidator({ nodeId, param, rule, context, draft }) {
    const { min, max } = rule.params || {};
    const val = context[nodeId]?.setting?.[param];
    if (!isFinite(val) || (min == null && max == null)) return;
    const res = val >= min && val <= max;
    draft.set(
        nodeId,
        param,
        VALIDATOR.RANGE,
        res ? [] : [rule.message || `Value must be between ${min} and ${max}`]
    );
}
