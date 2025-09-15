const SEVERITY_ERROR = 8;

const SIGNATURES = {
    self: [{ arities: [0], args: [] }],
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
        {
            arities: [2],
            args: [["number"], ["number"]],
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
export const CHILD_KEYS = {
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

function getRangeFromNode(node) {
    if (!node.loc)
        return {
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
        };
    return {
        startLineNumber: node.loc.start.line,
        startColumn: node.loc.start.column + 1, // Monaco columns start at 1
        endLineNumber: node.loc.end.line,
        endColumn: node.loc.end.column + 1,
    };
}

function addMarker(markers, node, message, severity = SEVERITY_ERROR) {
    markers.push({
        ...getRangeFromNode(node),
        message,
        severity,
    });
}

function getCalleeInfo(call) {
    if (call.type !== "CallExpression") return null;
    const base = call.base;
    if (base.type === "Identifier") {
        return {
            name: base.name,
            kind: "Identifier",
            target: base,
            object: null,
        };
    }
    if (base.type === "MemberExpression") {
        return {
            name: base.identifier?.name ?? null,
            kind: "MemberExpression",
            target: base.identifier ?? base,
            object: base.base?.name ?? null,
        };
    }
    return {
        name: null,
        kind: "Other",
        target: base ?? call,
        object: null,
    };
}

function isVarRef(node, varSet) {
    return node.type === "Identifier" && varSet.has(node.name);
}

function isNumberLike(node, varSet) {
    return inferType(node, varSet) === "number";
}

function isFunctionDecl(node) {
    return node.type === "FunctionDeclaration";
}

function inferType(node, varSet) {
    if (!node || typeof node !== "object") return "unknown";

    switch (node.type) {
        case "NumericLiteral":
            return "number";
        case "BooleanLiteral":
            return "boolean";
        case "StringLiteral":
            return "string";
        case "FunctionDeclaration":
            return "function";
        case "ParenthesisExpression":
            return inferType(node.expression, varSet);
        case "UnaryExpression": {
            if (node.operator === "-" || node.operator === "+") {
                return inferType(node.argument, varSet) === "number"
                    ? "number"
                    : "unknown";
            }
            return "unknown";
        }
        case "BinaryExpression": {
            const opsNumber = new Set(["+", "-", "*", "/", "%", "^"]);
            if (opsNumber.has(node.operator)) {
                const lt = inferType(node.left, varSet);
                const rt = inferType(node.right, varSet);
                return lt === "number" && rt === "number"
                    ? "number"
                    : "unknown";
            }
            return "unknown";
        }
        case "Identifier":
            return varSet.has(node.name) ? "number" : "unknown";
        case "CallExpression": {
            const callee = getCalleeInfo(node);
            if (!callee?.name) return "unknown";
            const overloads = SIGNATURES[callee.name];
            if (!overloads || overloads.length === 0) return "unknown";

            const allReturns = new Set(
                overloads.map((o) => o.returns ?? "unknown")
            );
            if (allReturns.size === 1) {
                const only = [...allReturns][0];
                return only;
            }
            return "unknown";
        }
        default:
            return "unknown";
    }
}

function checkArgByType(node, typeTag, varSet) {
    switch (typeTag) {
        case "varRef":
            return isVarRef(node, varSet);
        case "number":
            return isNumberLike(node, varSet);
        case "function":
            return isFunctionDecl(node);
        case "any":
            return true;
        default:
            return false;
    }
}

function isAllowedFunctionDecl(node, parent) {
    if (node.type !== "FunctionDeclaration") return false;
    if (!parent || parent.type !== "CallExpression") return false;
    const callee = getCalleeInfo(parent);
    return !callee || callee.name !== "delay" ? false : true;
    /* const idx = parent.arguments?.indexOf(node);
    return idx === 1; */
}

function humanTypeList(list) {
    return list.join("|"); // ["number","function"] -> "number|function"
}

function formatOverloadSignature(name, overload) {
    const parts = [];
    const fixedCount = Math.max(
        overload.arities?.[0] ?? 0,
        overload.minArgs ?? overload.args?.length ?? 0
    );

    for (let i = 0; i < fixedCount; i++) {
        const alts = overload.args?.[i] ?? ["any"];
        parts.push(humanTypeList(alts));
    }

    if (overload.varargs && overload.varargs.length > 0) {
        parts.push(humanTypeList(overload.varargs), "...");
    }

    return `${name}(${parts.join(", ")})`;
}

function formatAllSignatures(name, overload) {
    return overload.map((ov) => formatOverloadSignature(name, ov)).join(" / ");
}

function matchesArity(overload, argc) {
    if (Array.isArray(overload.arities) && overload.arities.length > 0) {
        return overload.arities.includes(argc);
    }

    const min = overload.minArgs ?? overload.args?.length ?? 0;
    const hasVarargs =
        Array.isArray(overload.varargs) && overload.varargs.length > 0;

    if (argc < min) return false;
    if (!hasVarargs) {
        const max = overload.args?.length ?? 0;
        return argc <= max;
    }

    return true;
}

function validateOverloadArgs(overload, args, varSet) {
    const errors = [];

    const fixedLen = Math.min(args.length, overload.args?.length ?? 0);
    for (let i = 0; i < fixedLen; i++) {
        const allowed = overload.args?.[i] ?? ["any"];
        const ok = allowed.some((t) => checkArgByType(args[i], t, varSet));
        if (!ok) {
            errors.push({ index: i, node: args[i], expected: allowed });
        }
    }

    const hasVarargs =
        Array.isArray(overload.varargs) && overload.varargs.length > 0;
    if (hasVarargs && args.length > (overload.args?.length ?? 0)) {
        for (let i = overload.args?.length; i < args.length; i++) {
            const allowed = overload.varargs;
            const ok = allowed.some((t) => checkArgByType(args[i], t, varSet));
            if (!ok) {
                errors.push({ index: i, node: args[i], expected: allowed });
            }
        }
    }

    return errors;
}

function checkCallExpression(node, markers, varSet) {
    const callee = getCalleeInfo(node);
    if (!callee?.name) return;

    if (
        callee.kind === "MemberExpression" &&
        ALLOWED_FUNCTIONS_SET.has(callee.name)
    ) {
        addMarker(
            markers,
            callee.target,
            `Функцию ${callee.name} нужно вызывать как ${callee.name}(...), а не как метод объекта`
        );
        return;
    }

    if (!ALLOWED_FUNCTIONS_SET.has(callee.name)) {
        addMarker(
            markers,
            callee.target,
            `Вызов запрещённой функции: ${callee.name}`
        );
        return;
    }

    const overloads = SIGNATURES[callee.name];
    if (!overloads || overloads.length === 0) return;

    const args = node.arguments ?? [];
    const argc = args.length;

    const candidates = overloads.filter((ov) => matchesArity(ov, argc));

    if (candidates.length === 0) {
        const variants = formatAllSignatures(callee.name, overloads);
        addMarker(
            markers,
            node,
            `Неверное число аргументов у ${callee.name}. Ожидается: ${variants}`
        );
        return;
    }

    let best = null;
    for (const ov of candidates) {
        const errs = validateOverloadArgs(ov, args, varSet);
        if (!best || errs.length < best.errs.length) {
            best = { ov, errs };
            if (errs.length === 0) break;
        }
    }

    if (best.errs.length > 0) {
        for (const e of best.errs) {
            const readable = humanTypeList(e.expected);
            addMarker(
                markers,
                e.node,
                `Аргумент #${e.index + 1} функции ${
                    callee.name
                } имеет неверный тип. Ожидается: ${readable}`
            );
        }
    }
}

function checkForbiddenConstructs(node, parent, markers) {
    if (node.type === "FunctionDeclaration") {
        if (!isAllowedFunctionDecl(node, parent)) {
            addMarker(
                markers,
                node,
                "Объявление функций разрешено только через delay"
            );
        }
        return;
    }
    if (FORBIDDEN_STATEMENTS.has(node.type)) {
        addMarker(
            markers,
            node,
            MESSAGES[node.type] ?? "Запрещённая конструкция"
        );
    }
}

function* iterateChildren(node) {
    const keys = CHILD_KEYS[node.type];
    if (!keys) return;
    for (const k of keys) {
        const v = node[k];
        if (Array.isArray(v)) {
            for (const c of v) if (c && typeof c === "object") yield c;
        } else if (v && typeof v === "object") yield v;
    }
}

export function validateCodeNew(ast, error, variables = []) {
    const markers = [];

    if (error) {
        markers.push({
            startLineNumber: error.line || 1,
            startColumn: error.column || 1,
            endLineNumber: error.line || 1,
            endColumn: error.column || 1 + 1,
            message: "Синтаксическая ошибка: " + error.message,
            severity: SEVERITY_ERROR,
        });
        return markers;
    }

    const varSet = new Set();
    for (const v of variables) {
        if (v.name) varSet.add(v.name);
    }

    const stack = [[ast, null]];
    while (stack.length) {
        const [node, parent] = stack.pop();
        if (!node) continue;

        checkForbiddenConstructs(node, parent, markers);
        if (node.type === "CallExpression") {
            checkCallExpression(node, markers, varSet);
        }

        for (const child of iterateChildren(node)) {
            stack.push([child, node]);
        }
    }

    return markers;
}
