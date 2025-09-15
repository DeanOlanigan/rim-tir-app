import { NODE_TYPES, VALIDATOR } from "../utils/const";
import { ErrorDraft } from "../core/ErrorDraft";
import {
    validateCode,
    validateCodeNew,
    validateCyclicVariable,
} from "../engines/luaValidationService";
import { luaAstParse } from "../engines/luaValidationService";
import { validateNamePatternMatch } from "../rules/name/nameValidation";
import { validateParameter } from "./validateParameter";
import { NODE_UNIQUE_NAMES } from "@/config/constants";
import { validateCyclicVariableAST } from "../engines/luaValidationService/validateCyclicVariable";

export function validateAllOld(settings, configuratorConfig) {
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
    if (node.name && node.rootId && NODE_UNIQUE_NAMES.has(node.type)) {
        draft.set(
            node.id,
            "name",
            VALIDATOR.REGEX,
            validateNamePatternMatch(node.name)
        );
        if (!map[node.rootId]) map[node.rootId] = new Map();
        map[node.rootId].set(node.name, [
            ...(map[node.rootId].get(node.name) || []),
            node.id,
        ]);
    }
}

function validateSettings(node, settings, draft, configuratorConfig) {
    if (!node.setting) return;
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

export function validateAll(settings, configuratorConfig) {
    const t0 = performance.now();
    const draft = new ErrorDraft();

    const variables = [];
    const uniqueBuckets = new Map();

    for (const node of Object.values(settings)) {
        if (node.type === NODE_TYPES.variable) {
            variables.push(node);
        }
        validateNamePatternOnePass(node, draft, uniqueBuckets);
        validateSettings(node, settings, draft, configuratorConfig);
    }

    const asts = new Map();

    for (const node of variables) {
        const expr = node.setting.luaExpression ?? "";

        const { ast, error } = luaAstParse(expr);
        if (ast) asts.set(node.id, { id: node.id, ast });

        const markers = validateCodeNew(ast, error, variables);
        draft.set(
            node.id,
            "luaExpression",
            "code",
            markers.map((m) => m.message)
        );
    }

    validateCyclicVariable({ variables, draft });

    console.log("ALL VALIDATION DRAFT", draft, performance.now() - t0);
    return draft;
}

function validateNamePatternOnePass(node, draft, buckets) {
    if (node.name && node.rootId && NODE_UNIQUE_NAMES.has(node.type)) {
        const regexErrors = validateNamePatternMatch(node.name);
        draft.set(node.id, "name", VALIDATOR.REGEX, regexErrors);

        let rootMap = buckets.get(node.rootId);
        if (!rootMap) {
            rootMap = new Map();
            buckets.set(node.rootId, rootMap);
        }
        const entry = rootMap.get(node.name);
        if (!entry) {
            rootMap.set(node.name, { firstId: node.id, dupCount: 0 });
            draft.set(node.id, "name", VALIDATOR.UNIQUE, []);
        } else {
            if (entry.dupCount === 0) {
                draft.set(node.id, "name", VALIDATOR.UNIQUE, [
                    `Значение "${node.name}" уже существует`,
                ]);
            }
            entry.dupCount++;
            draft.set(node.id, "name", VALIDATOR.UNIQUE, [
                `Значение "${node.name}" уже существует`,
            ]);
        }
    }
}
