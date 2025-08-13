import { SCOPE } from "../const";
import { getContextIds } from "../contextUtils";

export function uniqueCompositeValidator({ nodeId, rule, context, draft }) {
    const { within, fields } = rule.params || {};
    const ids = getContextIds(context, nodeId, null, within || SCOPE.SIBLINGS);
    const map = new Map();
    for (const id of ids) {
        const nodeSettings = context[id]?.setting || {};
        const val = `${nodeSettings?.[fields[0]]}${nodeSettings?.[fields[1]]}`;
        if (!map.has(val)) map.set(val, []);
        map.get(val).push(id);
    }
    for (const id of ids) {
        const nodeSettings = context[id]?.setting || {};
        const val = `${nodeSettings?.[fields[0]]}${nodeSettings?.[fields[1]]}`;
        const dupIds = map.get(val) || [];
        let msg = [];
        if (dupIds.length > 1) {
            msg = [rule.message];
        }
        draft.set(id, "node", "uniqueComposite", msg);
    }
}
