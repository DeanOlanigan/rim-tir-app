import { VALIDATOR } from "../../utils/const";

// TODO : Костыльная реализация
export function mustBeValidator({ nodeId, param, rule, context, draft }) {
    const allowed = rule.params;

    const val = context[nodeId]?.setting?.[param];
    const res = allowed.includes(val);
    draft.set(
        nodeId,
        param,
        VALIDATOR.MUSTBE,
        res ? [] : [rule.message || "Value is not allowed"]
    );
}
