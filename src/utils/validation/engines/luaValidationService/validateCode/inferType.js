import { SIGNATURES } from "./consts";
import { getCalleeInfo } from "./getCalleInfo";
import {
    canConcat,
    comparableForRel,
    isBoolean,
    isNumber,
    isString,
    isTable,
    unionType,
} from "./utils";

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

function processUnary(op, t) {
    if (UNARY_OPERATORS_NUM.has(op)) {
        if (op === "#") {
            let type;
            if (isString(t) || isTable(t)) type = "number";
            else if (t === "unknown") type = "unknown";
            else type = "number";
            return type;
        }
        return isNumber(t) ? "number" : "unknown";
    }

    if (UNARY_OPERATORS_BOOL.has(op)) {
        return isBoolean(t) ? "boolean" : "unknown";
    }

    return "unknown";
}

function processBinary(op, lt, rt) {
    if (BINARY_OPERATORS_NUM.has(op)) {
        return isNumber(lt) && isNumber(rt) ? "number" : "unknown";
    }

    if (BINARY_OPERATORS_STR.has(op)) {
        return canConcat(lt) && canConcat(rt) ? "string" : "unknown";
    }

    if (BINARY_OPERATORS_BOOL.has(op)) {
        return comparableForRel(op, rt, lt) ? "boolean" : "unknown";
    }

    if (BINARY_OPERATORS_ANY.has(op)) {
        return unionType(lt, rt);
    }

    return "unknown";
}

function proccessCall(callee) {
    if (!callee?.name) return "unknown";
    const overloads = SIGNATURES[callee.name];
    if (!overloads || overloads.length === 0) return "unknown";

    const returns = new Set(overloads.map((o) => o.returns ?? "unknown"));
    if (returns.size === 1) return [...returns][0];
    return "unknown";
}

export function inferType(node, varSet) {
    if (!node || typeof node !== "object") return "unknown";

    switch (node.type) {
        case "NilLiteral":
            return "nil";
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
            const t = inferType(node.argument, varSet);
            const op = node.operator;
            return processUnary(op, t);
        }

        case "BinaryExpression": {
            const op = node.operator;
            const lt = inferType(node.left, varSet);
            const rt = inferType(node.right, varSet);
            return processBinary(op, lt, rt);
        }

        case "Identifier":
            return varSet.has(node.name) ? "number" : "unknown";

        case "CallExpression": {
            const callee = getCalleeInfo(node);
            return proccessCall(callee);
        }
        default:
            return "unknown";
    }
}
