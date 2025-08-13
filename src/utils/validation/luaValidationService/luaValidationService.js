import { findCyclic } from "@/utils/validation/luaValidationService/findCyclic";
import { useValidationStore } from "@/store/validation-store";
import { ErrorDraft } from "../ErrorDraft";

export function validateCyclicVariable({
    variables,
    apply = false,
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
    apply && useValidationStore.getState().applyDraft2(draft);
    return draft;
}

export function setLuaCodeError(id, errorMsg) {
    const draft = new ErrorDraft();
    draft.set(id, "luaExpression", "code", errorMsg ? errorMsg : []);
    useValidationStore.getState().applyDraft2(draft);
}
