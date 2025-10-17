import { hasIgnoreAccessor, isEmpty } from "@/utils/utils";
import { VALIDATOR } from "../../utils/const";

export function requiredValidator({ nodeId, param, rule, context, draft }) {
    if (hasIgnoreAccessor(context, nodeId)) {
        draft.set(nodeId, param, VALIDATOR.REQUIRED, []);
        return;
    }
    const val = context[nodeId]?.setting?.[param];
    const res = !isEmpty(val);
    draft.set(
        nodeId,
        param,
        VALIDATOR.REQUIRED,
        res ? [] : [rule.message || "Обязательное поле"]
    );
}
