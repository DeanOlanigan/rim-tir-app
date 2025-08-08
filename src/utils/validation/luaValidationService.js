import { findCyclic } from "@/pages/ConfigurationPage/InputComponents/DebouncedEditor/findCyclic";
import { useValidationStore } from "@/store/validation-store";
import { setDraftMessage } from "./validator";

export function validateCyclicVariable(variables) {
    const cyclicFinderResult = findCyclic(variables);
    const errors = {};
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
        setDraftMessage(errors, nodeId, "name", "cyclic", msg);
    }
    useValidationStore.getState().setBulkErrors(errors);
}

export function setLuaCodeError(id, errorMsg) {
    const errors = {};
    setDraftMessage(
        errors,
        id,
        "luaExpression",
        "code",
        errorMsg ? errorMsg : []
    );
    useValidationStore.getState().setBulkErrors(errors);
}
