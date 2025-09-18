import {
    addMarker,
    checkCallExpression,
    FORBIDDEN_STATEMENTS,
    getCalleeInfo,
    MESSAGES,
} from "./validateCode";

export function validateCallExpression(node, markers, varIdsByName) {
    if (node.type === "CallExpression") {
        checkCallExpression(node, markers, varIdsByName);
    }
}

export function collectFunctionDecls(node, allFn, allowedFn) {
    if (node.type === "FunctionDeclaration") {
        allFn.push(node);
    }

    if (node.type === "CallExpression") {
        const callee = getCalleeInfo(node);
        if (
            callee.name === "delay" &&
            node.arguments?.[1]?.type === "FunctionDeclaration"
        ) {
            allowedFn.add(node.arguments[1]);
        }
    }
}

export function getVarsToCheckCycle(node, varIdsByName, varsToCheckCycle) {
    if (node.type === "AssignmentStatement") {
        node.variables.map((v) => {
            if (varIdsByName.has(v.name)) varsToCheckCycle.add(v.name);
        });
    }
    if (node.type === "CallExpression") {
        const callee = getCalleeInfo(node);
        if (
            callee.name === "update" &&
            varIdsByName.has(node.arguments?.[0].name)
        ) {
            varsToCheckCycle.add(node.arguments?.[0].name);
        }
    }
}

export function checkForbiddenConstructs(node, markers) {
    if (FORBIDDEN_STATEMENTS.has(node.type)) {
        addMarker(
            markers,
            node,
            MESSAGES[node.type] ?? "Запрещённая конструкция"
        );
    }
}

export function getVarsToHighlight(node, varIdsByName, varsToHighlight) {
    if (node.type === "Identifier" && varIdsByName.has(node.name)) {
        varsToHighlight.push(node);
    }
}
