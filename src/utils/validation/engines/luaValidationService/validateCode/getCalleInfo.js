export function getCalleeInfo(call) {
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
