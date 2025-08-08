import { VALIDATOR } from "../const";
import { setDraftMessage } from "../validator";

export function regexValidator({ nodeId, param, rule, context, draft }) {
    const { pattern } = rule.params || {};
    const re = rule._regex || (rule._regex = new RegExp(pattern));
    const val = context[nodeId]?.setting?.[param];
    const res = typeof val === "string" && re.test(val);
    setDraftMessage(
        draft,
        nodeId,
        param,
        VALIDATOR.REGEX,
        res ? [] : [rule.message || "Value does not match regex"]
    );
}
