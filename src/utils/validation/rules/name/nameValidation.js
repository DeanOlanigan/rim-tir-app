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

export function validateNamePatternMatch(name) {
    if (LUA_KEYWORDS.includes(name))
        return ["Имя узла содержит неподходящее слово"];
    if (!VARIABLE_NAME_PATTERN.test(name))
        return [
            "Имя узла должно начинаться с буквы или подчеркивания и содержать только латинские буквы, цифры или подчеркивания.",
        ];
    return [];
}
