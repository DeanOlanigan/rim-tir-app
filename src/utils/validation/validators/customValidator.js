import { VALIDATOR } from "../const";

export function customValidator({ nodeId, param, rule, context, draft }) {
    const fn = rule.params?.fn;
    const val = context[nodeId]?.setting?.[param];
    const res = typeof fn === "function" ? fn(nodeId, context, val) : true;
    draft.set(
        nodeId,
        param,
        VALIDATOR.CUSTOM,
        res ? [] : [rule.message || "Value does not match custom validator"]
    );
}
