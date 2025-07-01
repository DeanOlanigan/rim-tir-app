import { useCallback } from "react";
import { parse } from "luaparse";
import { setLuaCodeError } from "@/utils/validator";

export function useLuaDiagnostics() {
    const validate = useCallback((id, code, monaco, model) => {
        if (!monaco || !model) return;
        const markers = analyzeLuaForMonacoMarkers(code);
        monaco.editor.setModelMarkers(model, "lua", markers);
        setLuaCodeError(
            id,
            markers.map((m) => m.message)
        );
    }, []);
    return validate;
}

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

export function analyzeLuaForMonacoMarkers(code) {
    const markers = [];
    let ast;
    try {
        ast = parse(code, { locations: true });
    } catch (e) {
        // Ошибка синтаксиса — подсвечиваем её на первой строке (или парсим e.hash)
        markers.push({
            startLineNumber: e.line || 1,
            startColumn: e.column || 1,
            endLineNumber: e.line || 1,
            endColumn: e.column || 1 + 1,
            message: "Синтаксическая ошибка: " + e.message,
            severity: 8, // Error
        });
        return markers;
    }

    function walk(node, parent) {
        if (!node) return;

        // 1. Проверка на запрещённые конструкции
        if (node.type === "LocalStatement") {
            markers.push({
                ...getRangeFromNode(node),
                message: "Запрещено объявление переменных через local",
                severity: 8,
            });
        }
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
        if (node.type === "WhileStatement") {
            markers.push({
                ...getRangeFromNode(node),
                message: "Запрещён цикл while",
                severity: 8,
            });
        }
        if (node.type === "RepeatStatement") {
            markers.push({
                ...getRangeFromNode(node),
                message: "Запрещён цикл repeat",
                severity: 8,
            });
        }
        if (node.type === "GotoStatement") {
            markers.push({
                ...getRangeFromNode(node),
                message: "Запрещено использование goto",
                severity: 8,
            });
        }
        if (node.type === "BreakStatement") {
            markers.push({
                ...getRangeFromNode(node),
                message: "Запрещён break",
                severity: 8,
            });
        }
        if (node.type === "ReturnStatement") {
            markers.push({
                ...getRangeFromNode(node),
                message: "Запрещён return",
                severity: 8,
            });
        }

        // 2. Проверка запрещённых функций
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

        if (
            node.type === "CallExpression" &&
            node.base.type === "Identifier" &&
            node.base.name === "delay"
        ) {
            // Проверяем что первый аргумент - Literal (число), второй - Function
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

    // Возврат для setModelMarkers (если ошибок нет — массив пустой)
    return markers;
}
