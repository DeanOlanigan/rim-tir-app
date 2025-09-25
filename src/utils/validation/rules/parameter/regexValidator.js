import { VALIDATOR } from "../../utils/const";

export function regexValidator({ nodeId, param, rule, context, draft }) {
    const { regex } = rule.params || {};
    const re = rule._regex || (rule._regex = new RegExp(regex));
    const val = context[nodeId]?.setting?.[param];
    if (!val || typeof val !== "string") return;
    const res = re.test(val);
    draft.set(
        nodeId,
        param,
        VALIDATOR.REGEX,
        res ? [] : [rule.message || "Value does not match regex"]
    );
}
