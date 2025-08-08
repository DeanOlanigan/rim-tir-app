import { SCOPE, VALIDATOR } from "../const";
import { getContextIds } from "../contextUtils";
import { setDraftMessage } from "../validator";

export function uniqueValidator({ nodeId, param, rule, context, draft }) {
    const { within } = rule.params || {};
    const ids = getContextIds(context, nodeId, param, within || SCOPE.SIBLINGS);

    const map = new Map();
    for (const id of ids) {
        const val = context[id]?.setting?.[param];
        if (val === undefined || val == "") continue;
        if (!map.has(val)) map.set(val, []);
        map.get(val).push(id);
    }
    for (const id of ids) {
        const val = context[id]?.setting?.[param];
        const dupIds = map.get(val) || [];
        let msg = [];
        if (dupIds.length > 1) {
            msg = [
                rule.message ||
                    `Значение "${val}" уже существует: ${dupIds
                        .filter((dId) => dId !== id)
                        .join(", ")}`,
            ];
        }
        setDraftMessage(draft, id, param, VALIDATOR.UNIQUE, msg);
    }
}
