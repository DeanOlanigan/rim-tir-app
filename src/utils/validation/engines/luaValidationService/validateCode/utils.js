import { SEVERITY_ERROR } from "./consts";

function isString(t) {
    return t === "string";
}
function isBoolean(t) {
    return t === "boolean";
}
function isTable(t) {
    return t === "table";
}
function isNumber(t) {
    return t === "number";
}
function canConcat(t) {
    return isString(t) || isNumber(t);
}

function comparableForRel(op, rt, lt) {
    if (op === "==" || op === "~=") return true;
    return (isNumber(lt) && isNumber(rt)) || (isString(lt) && isString(rt));
}

function unionType(a, b) {
    if (a === b) return a;
    if (a === "unknown") return b;
    if (b === "unknown") return a;
    if (a === "any" || b === "any") return "any";
    return "any";
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

function addMarker(markers, node, message, severity = SEVERITY_ERROR) {
    markers.push({
        ...getRangeFromNode(node),
        message,
        severity,
    });
}

export {
    isString,
    isBoolean,
    isTable,
    isNumber,
    canConcat,
    comparableForRel,
    unionType,
    addMarker,
};
