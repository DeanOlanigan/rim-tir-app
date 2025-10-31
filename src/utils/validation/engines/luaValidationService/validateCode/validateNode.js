import { FORBIDDEN_STATEMENTS, MESSAGES } from "./consts";
import { getCalleeInfo } from "./getCalleInfo";
import { addMarker } from "./utils";
import { checkCallExpression } from "./validateCode";

function checkDivision(node, markers) {
    if (
        node.type === "BinaryExpression" &&
        node.operator === "/" &&
        node.right.value === 0
    ) {
        addMarker(markers, node, "Деление на ноль");
    }
}

function validateCallExpression(node, markers, varIdsByName) {
    if (node.type === "CallExpression") {
        checkCallExpression(node, markers, varIdsByName);
    }
}

function collectFunctionDecls(node, allFn, allowedFn) {
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

function getVarsToCheckCycle(node, varIdsByName, varsToCheckCycle) {
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

function checkForbiddenConstructs(node, markers) {
    if (FORBIDDEN_STATEMENTS.has(node.type)) {
        addMarker(
            markers,
            node,
            MESSAGES[node.type] ?? "Запрещённая конструкция"
        );
    }
}

function getVarsToHighlight(node, varIdsByName, varsToHighlight) {
    if (node.type === "Identifier" && varIdsByName.has(node.name)) {
        varsToHighlight.push(node);
    }
}

export {
    checkDivision,
    validateCallExpression,
    collectFunctionDecls,
    getVarsToCheckCycle,
    checkForbiddenConstructs,
    getVarsToHighlight,
};
