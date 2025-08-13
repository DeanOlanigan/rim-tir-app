import { useValidationStore } from "@/store/validation-store";
import { VALIDATOR } from "./const";
import { ErrorDraft } from "./ErrorDraft";
import { validateCyclicVariable } from "./luaValidationService/luaValidationService";
import { luaAstParse } from "./luaValidationService/luaAstParser";
import { analyzeLuaForMonacoMarkers } from "@/pages/ConfigurationPage/InputComponents/DebouncedEditor/hooks/useLuaDiagnostics";
import { validateNamePatternMatch } from "./nameValidation";
import { validateParameter } from "./validator";

export function validateAll(settings) {
    const draft = new ErrorDraft();
    const map = {};
    const variables = [];
    const asts = [];
    for (const node of Object.values(settings)) {
        validateVariableCode(node, variables, asts, draft);
        validateNamePattern(node, draft, map);
        validateSettings(node, settings, draft);
    }

    for (const rootId in map) {
        for (const [name, ids] of map[rootId].entries()) {
            if (ids.length > 1) {
                ids.forEach((id) => {
                    draft.set(id, "name", VALIDATOR.UNIQUE, [
                        `Значение "${name}" уже существует`,
                    ]);
                });
            }
        }
    }

    validateCyclicVariable({ variables, draft });
    console.log("ALL VALIDATION DRAFT", draft);
    useValidationStore.getState().applyDraft2(draft);
}

function validateVariableCode(node, variables, asts, draft) {
    if (node.type === "variable") {
        variables.push(node);
        // TODO Подумать, как можно оптимизировать работу с ast (переиспользование)
        const { ast, error } = luaAstParse(node.setting.luaExpression);
        if (ast) asts.push({ id: node.id, ast });
        const markers = analyzeLuaForMonacoMarkers(ast, error);
        draft.set(
            node.id,
            "luaExpression",
            "code",
            markers.map((m) => m.message)
        );
    }
}

function validateNamePattern(node, draft, map) {
    if (
        node.name &&
        node.rootId &&
        node.type !== "dataObject" &&
        ["protocol", "interface", "variable"].includes(node.type)
    ) {
        draft.set(
            node.id,
            "name",
            VALIDATOR.REGEX,
            validateNamePatternMatch({ name: node.name })
        );
        if (!map[node.rootId]) map[node.rootId] = new Map();
        map[node.rootId].set(node.name, [
            ...(map[node.rootId].get(node.name) || []),
            node.id,
        ]);
    }
}

function validateSettings(node, settings, draft) {
    if (node.setting) {
        for (const paramKey of Object.keys(node.setting)) {
            validateParameter(node.id, paramKey, settings, draft);
        }
    }
}
