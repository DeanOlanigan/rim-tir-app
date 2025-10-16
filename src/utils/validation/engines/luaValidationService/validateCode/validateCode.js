import { ALLOWED_FUNCTIONS_SET, SIGNATURES } from "./consts";
import { getCalleeInfo } from "./getCalleInfo";
import { inferType } from "./inferType";
import { addMarker, isNumber } from "./utils";

function isVarRef(node, varSet) {
    return node.type === "Identifier" && varSet.has(node.name);
}

function isNumberLike(node, varSet) {
    return isNumber(inferType(node, varSet));
}

function isFunctionDecl(node) {
    return node.type === "FunctionDeclaration";
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

export function checkCallExpression(node, markers, varSet) {
    const callee = getCalleeInfo(node);
    if (!callee.name) return;
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
