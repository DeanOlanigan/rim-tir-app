import { hasIgnoreAccessor } from "@/utils/checkers";
import { VALIDATOR } from "../../utils/const";

export function rangeValidator({ nodeId, param, rule, context, draft }) {
    if (hasIgnoreAccessor(context, nodeId)) {
        draft.set(nodeId, param, VALIDATOR.RANGE, []);
        return;
    }
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
