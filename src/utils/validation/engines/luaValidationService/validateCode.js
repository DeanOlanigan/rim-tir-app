const SEVERITY_ERROR = 8;

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

const ALLOWED_FUNCTIONS_SET = new Set([
    "self",
    "update",
    "delay",
    "set",
    "abs",
    "sin",
    "cos",
    "sqrt",
]);

function isVarRef(node, varSet) {
    return node.type === "Identifier" && varSet.has(node.name);
}

function isNumberLike(node, varSet) {
    return inferType(node, varSet) === "number";
}

function isFunctionDecl(node) {
    return node.type === "FunctionDeclaration";
}

function isAny() {
    return true;
}

const SIGNATURES = {
    self: { arities: [0], args: [] },
    update: { arities: [1], args: [["varRef"]] },
    delay: { arities: [2], args: [["number"], ["function"]] },
    set: { arities: [1], args: [["number"]] },
    abs: { arities: [1], args: [["number"]], returns: "number" },
    sin: { arities: [1], args: [["number"]], returns: "number" },
    cos: { arities: [1], args: [["number"]], returns: "number" },
    sqrt: { arities: [1], args: [["number"]], returns: "number" },
};

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
            const spec = SIGNATURES[callee.name];
            return spec?.returns ?? "unknown";
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
            return isAny();
        default:
            return false;
    }
}

const FORBIDDEN_STATEMENTS = new Set([
    "LocalStatement",
    "ForNumericStatement",
    "ForGenericStatement",
    "WhileStatement",
    "RepeatStatement",
    "GotoStatement",
    "BreakStatement",
    "ReturnStatement",
]);

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

function isAllowedFunctionDecl(node, parent) {
    if (node.type !== "FunctionDeclaration") return false;
    if (!parent || parent.type !== "CallExpression") return false;
    const callee = getCalleeInfo(parent);
    return !callee || callee.name !== "delay" ? false : true;
    /* const idx = parent.arguments?.indexOf(node);
    return idx === 1; */
}

function formatList(items, max = 5) {
    const arr = Array.from(items);
    return arr.length <= max
        ? arr.join(", ")
        : arr.slice(0, max).join(", ") + "…";
}

function humanTypeList(list) {
    return list.join("|"); // ["number","function"] -> "number|function"
}

function formatSignature(name, spec) {
    // spec.args[i] — массив допустимых «типов» для i-го аргумента
    const maxA = Math.max(...spec.arities);
    return spec.arities
        .map((a) => {
            const parts = [];
            for (let i = 0; i < a; i++) {
                const alts = spec.args?.[i] ?? ["any"];
                parts.push(humanTypeList(alts));
            }
            return `${name}(${parts.join(", ")})`;
        })
        .join(" / ");
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
            `Вызов запрещённой функции: ${callee.name}`
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

    const spec = SIGNATURES[callee.name];
    if (!spec) return;

    const args = node.arguments ?? [];
    if (!spec.arities.includes(args.length)) {
        /* const variants = spec.arities
            .map(
                (arity) =>
                    `${callee.name}(${new Array(arity).fill("…").join(", ")})`
            )
            .join(" / "); */
        const variants = formatSignature(callee.name, spec);
        addMarker(
            markers,
            node,
            `Неверное число аргументов у ${callee.name}. Ожидается: ${variants}`
        );
        return;
    }

    for (let i = 0; i < args.length; i++) {
        const nodeArg = args[i];
        const allowedTypes = spec.args[i] ?? ["any"];
        const ok = allowedTypes.some((tag) =>
            checkArgByType(nodeArg, tag, varSet)
        );
        if (!ok) {
            const readable = allowedTypes.join("|");
            addMarker(
                markers,
                nodeArg,
                `Аргумент #${i + 1} функции ${
                    callee.name
                } имеет неверный тип. Ожидается: ${readable}`
            );
            if (allowedTypes.includes("varRef")) {
                addMarker(
                    markers,
                    nodeArg,
                    `Должен быть идентификатор существующей переменной (${formatList(
                        varSet
                    )})`
                );
            }
            return;
        }
    }

    if (callee.name === "delay") {
        const args = node.arguments ?? [];
        const ok =
            args.length === 2 &&
            args[0]?.type === "NumericLiteral" &&
            args[1]?.type === "FunctionDeclaration";

        if (!ok) {
            addMarker(
                markers,
                callee.target,
                "delay должен вызываться как delay(<секунды>, function() ... end)"
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
