import jsonLogic from "json-logic-js";
import { getContextIds } from "./contextUtils";

const find = function (a) {
    const context = _jsonLogicContext;
    if (!context || !context.data || !context.id) return null;
    const ids = getContextIds(context.data, context.id, a.what, a.where);
    const res = ids.map((id) => context.data[id]?.setting?.[a.what]);
    return res.length > 1 ? res : res[0];
};

let _jsonLogicContext = null;
function applyWithContext(rule, context) {
    _jsonLogicContext = context;
    try {
        return jsonLogic.apply(rule);
    } finally {
        _jsonLogicContext = null;
    }
}

jsonLogic.add_operation("find", find);

export function checkDependencies(dependencies, context, nodeId) {
    if (!dependencies) return true;
    try {
        const logicResult = applyWithContext(dependencies, {
            data: context,
            id: nodeId,
        });
        return logicResult;
    } catch {
        return false;
    }
}
