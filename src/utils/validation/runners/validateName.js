import { getContextIds } from "../utils/contextUtils";
import { ErrorDraft } from "../core/ErrorDraft";
import { validateNamePatternMatch } from "../rules/name/nameValidation";
import {
    SCOPE,
    VALIDATOR,
    DO_NOT_VALIDATE,
    NODE_UNIQUE_NAMES,
} from "../utils/const";
import { hasIgnoreAccessor } from "@/utils/checkers";

export function validateName({
    id,
    settings,
    scope = SCOPE.ROOT,
    draft = new ErrorDraft(),
}) {
    if (!NODE_UNIQUE_NAMES.has(settings[id].type)) return;
    const name = settings[id]?.name;
    const error = validateNamePatternMatch(name);
    draft.set(id, "name", VALIDATOR.REGEX, error);

    const ids = getContextIds(settings, id, "name", scope, DO_NOT_VALIDATE);
    const map = new Map();
    for (const id of ids) {
        if (hasIgnoreAccessor(settings, id)) continue;
        const node = settings[id] || {};
        if (!NODE_UNIQUE_NAMES.has(node.type)) continue;
        const val = node?.name;
        if (val === undefined || val == "") continue;
        if (!map.has(val)) map.set(val, []);
        map.get(val).push(id);
    }
    for (const id of ids) {
        const val = settings[id]?.name;
        const dupIds = map.get(val) || [];
        let msg = [];
        if (dupIds.length > 1) {
            msg = [`Значение "${val}" уже существует`];
        }
        draft.set(id, "name", VALIDATOR.UNIQUE, msg);
    }
    return draft;
}
