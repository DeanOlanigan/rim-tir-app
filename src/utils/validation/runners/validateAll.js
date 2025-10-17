import { NODE_UNIQUE_NAMES, VALIDATOR } from "../utils/const";
import { ErrorDraft } from "../core/ErrorDraft";
import { validateNamePatternMatch } from "../rules/name/nameValidation";
import { validateParameter } from "./validateParameter";
import { validateVariableSpecific } from "./validateVariableSpecific";
import { getVariableMaps } from "../utils/get";
import { hasIgnoreAccessor } from "@/utils/utils";

export function validateAll(settings, configuratorConfig) {
    const t0 = performance.now();
    const draft = new ErrorDraft();

    const varIdsByName = new Map();
    const varNameById = new Map();
    const depGraphById = {};

    const uniqueBuckets = new Map();

    for (const node of Object.values(settings)) {
        getVariableMaps(node, varIdsByName, varNameById);
        validateNamePatternOnePass(settings, node, uniqueBuckets, draft);
        validateSettings(node, settings, configuratorConfig, draft);
    }

    validateVariableSpecific(
        varNameById,
        varIdsByName,
        depGraphById,
        settings,
        draft
    );

    console.log("ALL VALIDATION DRAFT", draft, performance.now() - t0);
    return draft;
}

function validateNamePatternOnePass(settings, node, buckets, draft) {
    if (node.name && node.rootId && NODE_UNIQUE_NAMES.has(node.type)) {
        const regexErrors = validateNamePatternMatch(node.name);
        draft.set(node.id, "name", VALIDATOR.REGEX, regexErrors);

        if (hasIgnoreAccessor(settings, node.id)) return;

        let rootMap = buckets.get(node.rootId);
        if (!rootMap) {
            rootMap = new Map();
            buckets.set(node.rootId, rootMap);
        }

        let entry = rootMap.get(node.name);
        if (!entry) {
            entry = { firstId: node.id, hasDup: false };
            rootMap.set(node.name, entry);
            draft.set(node.id, "name", VALIDATOR.UNIQUE, []);
        } else {
            if (!entry.hasDup) {
                entry.hasDup = true;
                draft.set(entry.firstId, "name", VALIDATOR.UNIQUE, [
                    `Значение "${node.name}" уже существует`,
                ]);
            }
            draft.set(node.id, "name", VALIDATOR.UNIQUE, [
                `Значение "${node.name}" уже существует`,
            ]);
        }
    }
}

function validateSettings(node, settings, configuratorConfig, draft) {
    if (!node.setting) return;
    for (const paramKey of Object.keys(node.setting)) {
        validateParameter({
            id: node.id,
            param: paramKey,
            settings,
            cfg: configuratorConfig,
            draft,
        });
    }
}
