const SEVERITY_ERROR = 8;

const SIGNATURES = {
    self: [{ arities: [0], args: [], returns: "number" }],
    update: [{ arities: [1], args: [["varRef"]] }],
    delay: [{ arities: [2], args: [["number"], ["function"]] }],
    set: [{ arities: [1], args: [["number"]] }],
    abs: [{ arities: [1], args: [["number"]], returns: "number" }],
    acos: [{ arities: [1], args: [["number"]], returns: "number" }],
    asin: [{ arities: [1], args: [["number"]], returns: "number" }],
    atan: [
        { arities: [1], args: [["number"]], returns: "number" },
        { arities: [2], args: [["number"], ["number"]], returns: "number" },
    ],
    cos: [{ arities: [1], args: [["number"]], returns: "number" }],
    deg: [{ arities: [1], args: [["number"]], returns: "number" }],
    exp: [{ arities: [1], args: [["number"]], returns: "number" }],
    log: [
        { arities: [1], args: [["number"]], returns: "number" },
        { arities: [2], args: [["number"], ["number"]], returns: "number" },
    ],
    max: [
        {
            minArgs: 1,
            args: [["number"]],
            varargs: ["number"],
            returns: "number",
        },
    ],
    min: [
        {
            minArgs: 1,
            args: [["number"]],
            varargs: ["number"],
            returns: "number",
        },
    ],
    rad: [{ arities: [1], args: [["number"]], returns: "number" }],
    random: [
        {
            arities: [0],
            args: [],
            returns: "number",
        },
        {
            arities: [1],
            args: [["number"]],
            returns: "number",
        },
    ],
    randomseed: [{ arities: [1], args: [["number"]], returns: "number" }],
    sin: [{ arities: [1], args: [["number"]], returns: "number" }],
    sqrt: [{ arities: [1], args: [["number"]], returns: "number" }],
    tan: [{ arities: [1], args: [["number"]], returns: "number" }],
};

const ALLOWED_FUNCTIONS_SET = new Set(Object.keys(SIGNATURES));

const MESSAGES = {
    LocalStatement: "Запрещено объявление переменных через local",
    ForNumericStatement: "Запрещено использование цикла for",
    ForGenericStatement: "Запрещено использование цикла for",
    WhileStatement: "Запрещено использование цикла while",
    RepeatStatement: "Запрещено использование цикла repeat",
    GotoStatement: "Запрещено использование goto",
    BreakStatement: "Запрещено использование break",
    ReturnStatement: "Запрещено использование return",
};

const FORBIDDEN_STATEMENTS = new Set(Object.keys(MESSAGES));

// Точечный обход ast
const CHILD_KEYS = {
    Chunk: ["body"],
    BlockStatement: ["body"],
    CallStatement: ["expression"],
    AssignmentStatement: ["variables", "init"],
    CallExpression: ["base", "arguments"],
    MemberExpression: ["base", "identifier"],
    FunctionDeclaration: ["parameters", "body"],
    IfStatement: ["clauses"],
    IfClause: ["condition", "body"],
    ElseifClause: ["condition", "body"],
    ElseClause: ["body"],
};

const BINARY_OPERATORS_NUM = new Set([
    "+",
    "-",
    "*",
    "/",
    "//",
    "%",
    "^",
    "&",
    "|",
    "~",
    "<<",
    ">>",
]);
const BINARY_OPERATORS_STR = new Set([".."]);
const BINARY_OPERATORS_BOOL = new Set(["<", ">", "<=", ">=", "==", "~="]);
const BINARY_OPERATORS_ANY = new Set(["and", "or"]);

const UNARY_OPERATORS_NUM = new Set(["-", "~", "#"]);
const UNARY_OPERATORS_BOOL = new Set(["not"]);

export {
    SEVERITY_ERROR,
    SIGNATURES,
    ALLOWED_FUNCTIONS_SET,
    MESSAGES,
    FORBIDDEN_STATEMENTS,
    CHILD_KEYS,
    BINARY_OPERATORS_NUM,
    BINARY_OPERATORS_STR,
    BINARY_OPERATORS_BOOL,
    BINARY_OPERATORS_ANY,
    UNARY_OPERATORS_NUM,
    UNARY_OPERATORS_BOOL,
};
