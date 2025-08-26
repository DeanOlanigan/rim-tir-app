import { VALIDATOR } from "../utils/const";
import { ErrorDraft } from "../core/ErrorDraft";
import {
    validateCode,
    validateCyclicVariable,
} from "../engines/luaValidationService";
import { luaAstParse } from "../engines/luaValidationService";
import { validateNamePatternMatch } from "../rules/name/nameValidation";
import { validateParameter } from "./validateParameter";
import { NODE_TYPES } from "../utils/const";
import { NODE_UNIQUE_NAMES } from "@/config/constants";

export function validateAll(settings, configuratorConfig) {
    const t0 = performance.now();
    const draft = new ErrorDraft();
    const map = {};
    const variables = [];
    const asts = new Map();
    for (const node of Object.values(settings)) {
        validateVariableCode(node, variables, asts, draft);
        validateNamePattern(node, draft, map);
        validateSettings(node, settings, draft, configuratorConfig);
    }

    for (const rootId in map) {
        for (const [name, ids] of map[rootId].entries()) {
            if (ids.length > 1) {
                ids.forEach((id) => {
                    draft.set(id, "name", VALIDATOR.UNIQUE, [
                        `Значение "${name}" уже существует`,
                    ]);
                });
            } else {
                draft.set(ids[0], "name", VALIDATOR.UNIQUE, []);
            }
        }
    }

    validateCyclicVariable({ variables, draft });
    console.log("ALL VALIDATION DRAFT", draft, performance.now() - t0);
    return draft;
}

function validateVariableCode(node, variables, asts, draft) {
    if (node.type === "variable") {
        variables.push(node);
        // TODO Подумать, как можно оптимизировать работу с ast (переиспользование)
        const { ast, error } = luaAstParse(node.setting.luaExpression);
        if (ast) asts.set(node.id, { id: node.id, ast });
        //console.log(asts);
        const markers = validateCode(ast, error);
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
        node.type !== NODE_TYPES.dataObject &&
        NODE_UNIQUE_NAMES.includes(node.type)
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

function validateSettings(node, settings, draft, configuratorConfig) {
    if (node.setting) {
        for (const paramKey of Object.keys(node.setting)) {
            validateParameter(
                node.id,
                paramKey,
                settings,
                configuratorConfig,
                draft
            );
        }
    }
}
