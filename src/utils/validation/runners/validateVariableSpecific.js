import { ErrorDraft } from "../core/ErrorDraft";
import { luaAstParse } from "../engines/luaValidationService";
import { tarjanCyclicDeps } from "../utils/tarjan";
import { getVarDataStore } from "../utils/get";

export function revalidateVars(newSettings, draft = new ErrorDraft()) {
    const depGraphById = {};
    const { varIdsByName, varNameById } = getVarDataStore(newSettings);
    validateVariableSpecific(
        varNameById,
        varIdsByName,
        depGraphById,
        newSettings,
        draft
    );
    return draft;
}

export function validateVariableSpecific(
    varNameById,
    varIdsByName,
    depGraphById,
    settings,
    draft
) {
    for (const id of varNameById.keys()) {
        const node = settings[id];
        const expr = node.setting?.luaExpression;
        if (!expr) continue;
        const { markers, varsToCheckCycle } = luaAstParse(
            expr,
            varIdsByName,
            id
        );
        draft.set(
            id,
            "luaExpression",
            "code",
            markers.map((m) => m.message)
        );
        addToDepGraph(varsToCheckCycle, depGraphById, varIdsByName, id);
    }

    validateVariableCyclic(depGraphById, varNameById, draft);
}

function validateVariableCyclic(depGraphById, varNameById, draft) {
    const tarjan = tarjanCyclicDeps(depGraphById);
    for (const [nodeId, scc] of Object.entries(tarjan)) {
        let msg = [];
        if (scc) {
            const names = scc.map((v) => varNameById.get(v)).join("->");
            msg = [`Обнаружена циклическая зависимость: ${names}`];
        }
        draft.set(nodeId, "name", "cyclic", msg);
    }
}

function addToDepGraph(varsToCheckCycle, depGraphById, varIdsByName, id) {
    if (!depGraphById[id]) depGraphById[id] = new Set();
    for (const rName of varsToCheckCycle) {
        if (!rName) continue;
        const targets = varIdsByName.get(rName) ?? new Set();
        if (targets.size === 1) {
            const [targetId] = targets;
            depGraphById[id].add(targetId);
        }
    }
}
