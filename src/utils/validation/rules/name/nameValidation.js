import { SCOPE, VALIDATOR } from "../../utils/const";
import { getContextIds } from "../../utils/contextUtils";
import { ErrorDraft } from "../../core/ErrorDraft";
import { DO_NOT_VALIDATE, NODE_UNIQUE_NAMES } from "@/config/constants";

const LUA_KEYWORDS = [
    "and",
    "break",
    "do",
    "else",
    "elseif",
    "end",
    "false",
    "for",
    "function",
    "goto",
    "if",
    "in",
    "local",
    "nil",
    "not",
    "or",
    "repeat",
    "return",
    "then",
    "true",
    "until",
    "while",
];

// Replace this character class by the character itself.eslintsonarjs/single-char-in-character-classes
const VARIABLE_NAME_PATTERN = /^[a-zA-Z_][\w]*$/;

export function validateNamePatternMatch({ name }) {
    if (LUA_KEYWORDS.includes(name))
        return ["Имя узла содержит неподходящее слово"];
    if (!VARIABLE_NAME_PATTERN.test(name))
        return [
            "Имя узла должно начинаться с буквы или подчеркивания и содержать только буквы, цифры или подчеркивания",
        ];
    return [];
}

export function validateName({
    id,
    settings,
    scope = SCOPE.ROOT,
    draft = new ErrorDraft(),
}) {
    const name = settings[id]?.name;
    const error = validateNamePatternMatch({ name });
    draft.set(id, "name", VALIDATOR.REGEX, error);

    const ids = getContextIds(settings, id, "name", scope, DO_NOT_VALIDATE);
    const map = new Map();
    for (const id of ids) {
        const node = settings[id] || {};
        if (NODE_UNIQUE_NAMES.has(node.type)) {
            const val = node?.name;
            if (val === undefined || val == "") continue;
            if (!map.has(val)) map.set(val, []);
            map.get(val).push(id);
        }
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
