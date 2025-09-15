import { findCyclic, findCyclicFromAST } from "./findCyclic";
import { ErrorDraft } from "../../core/ErrorDraft";

export function validateCyclicVariable({
    variables,
    draft = new ErrorDraft(),
}) {
    const cyclicFinderResult = findCyclic(variables);
    for (const [nodeId, val] of Object.entries(cyclicFinderResult)) {
        let msg;
        if (val) {
            const names = val
                .map((v) => variables.find((v2) => v2.id === v).name)
                .join("->");
            msg = [`Обнаружена циклическая зависимость: ${names}`];
        } else {
            msg = [];
        }
        draft.set(nodeId, "name", "cyclic", msg);
    }
    return draft;
}

export function validateCyclicVariableAST({
    variables,
    draft = new ErrorDraft(),
    asts,
}) {
    const cyclicFinderResult = findCyclicFromAST(variables, asts);
    for (const [nodeId, val] of Object.entries(cyclicFinderResult)) {
        let msg;
        if (val) {
            const names = val
                .map((v) => variables.find((v2) => v2.id === v).name)
                .join("->");
            msg = [`Обнаружена циклическая зависимость: ${names}`];
        } else {
            msg = [];
        }
        draft.set(nodeId, "name", "cyclic", msg);
    }
    return draft;
}
