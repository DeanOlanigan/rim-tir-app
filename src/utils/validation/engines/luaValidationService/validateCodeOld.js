const ALLOWED_FUNCTIONS = [
    "self",
    "update",
    "delay",
    "set",
    "abs",
    "sin",
    "cos",
    "sqrt",
];

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

function checkStatement(node, statement, markers, message) {
    if (node.type === statement) {
        markers.push({
            ...getRangeFromNode(node),
            message,
            severity: 8,
        });
    }
}

function checkForbiddenFunction(node, markers) {
    if (node.type === "CallExpression") {
        let functionName = "";
        if (node.base.type === "Identifier") {
            functionName = node.base.name;
        } else if (node.base.type === "MemberExpression") {
            functionName = node.base.identifier.name;
        }
        if (functionName && !ALLOWED_FUNCTIONS.includes(functionName)) {
            markers.push({
                ...getRangeFromNode(node.base),
                message: `Вызов запрещённой функции: ${functionName}`,
                severity: 8,
            });
        }
    }
}

function checkDelayFunction(node, markers) {
    if (
        node.type === "CallExpression" &&
        node.base.type === "Identifier" &&
        node.base.name === "delay"
    ) {
        if (
            node.arguments.length !== 2 ||
            node.arguments[0].type !== "NumericLiteral" ||
            node.arguments[1].type !== "FunctionDeclaration"
        ) {
            markers.push({
                ...getRangeFromNode(node),
                message:
                    "delay должен вызываться как delay(<секунды>, function() ... end)",
                severity: 8,
            });
        }
    }
}

function checkForbidenConstructs(node, parent, markers) {
    checkStatement(
        node,
        "LocalStatement",
        markers,
        "Запрещено объявление переменных через local"
    );
    if (node.type === "FunctionDeclaration") {
        let isAllowed = false;
        if (
            parent &&
            parent.type === "CallExpression" &&
            parent.base.type === "Identifier" &&
            parent.base.name === "delay"
        ) {
            const idx = parent.arguments.indexOf(node);
            if (idx === 1) {
                isAllowed = true;
            }
        }

        if (!isAllowed) {
            markers.push({
                ...getRangeFromNode(node),
                message: "Объявление функций разрешено только через delay",
                severity: 8,
            });
        }
    }
    if (
        node.type === "ForNumericStatement" ||
        node.type === "ForGenericStatement"
    ) {
        markers.push({
            ...getRangeFromNode(node),
            message: "Запрещены циклы for",
            severity: 8,
        });
    }
    checkStatement(node, "WhileStatement", markers, "Запрещён цикл while");
    checkStatement(node, "RepeatStatement", markers, "Запрещён цикл repeat");
    checkStatement(
        node,
        "GotoStatement",
        markers,
        "Запрещено использование goto"
    );
    checkStatement(node, "BreakStatement", markers, "Запрещён break");
    checkStatement(node, "ReturnStatement", markers, "Запрещён return");
}

export function validateCode(ast, error) {
    const markers = [];
    if (error) {
        markers.push({
            startLineNumber: error.line || 1,
            startColumn: error.column || 1,
            endLineNumber: error.line || 1,
            endColumn: error.column || 1 + 1,
            message: "Синтаксическая ошибка: " + error.message,
            severity: 8, // Error
        });
        return markers;
    }

    function walk(node, parent) {
        if (!node) return;

        // 1. Проверка на запрещённые конструкции
        checkForbidenConstructs(node, parent, markers);

        // 2. Проверка запрещённых функций
        checkForbiddenFunction(node, markers);
        checkDelayFunction(node, markers);

        // Рекурсивно обходим AST
        for (const key in node) {
            if (Array.isArray(node[key])) {
                node[key].forEach((child) => {
                    if (typeof child === "object" && child !== null) {
                        walk(child, node);
                    }
                });
            } else if (
                typeof node[key] === "object" &&
                node[key] !== null &&
                node[key].type
            ) {
                walk(node[key], node);
            }
        }
    }

    walk(ast, null);

    return markers;
}
