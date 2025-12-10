import { hasIgnoreAccessor } from "@/utils/checkers";
import { VALIDATOR } from "../../utils/const";

// TODO : Костыльная реализация
export function mustBeValidator({ nodeId, param, rule, context, draft }) {
    if (hasIgnoreAccessor(context, nodeId)) {
        draft.set(nodeId, param, VALIDATOR.MUSTBE, []);
        return;
    }
    const allowed = rule.params;
    const val = context[nodeId]?.setting?.[param];
    if (val === "") return;
    const res = allowed.includes(val);
    draft.set(
        nodeId,
        param,
        VALIDATOR.MUSTBE,
        res ? [] : [rule.message || "Value is not allowed"],
    );
}
