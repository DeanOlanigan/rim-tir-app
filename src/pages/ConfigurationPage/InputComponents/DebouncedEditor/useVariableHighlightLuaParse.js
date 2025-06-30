import { parse } from "luaparse";
import { useCallback, useRef } from "react";

export function useVariableHighlightLuaParse() {
    const decorationIdRef = useRef([]);

    const highlight = useCallback((code, editor, variables) => {
        if (!editor || !code) return;
        let usages;
        try {
            usages = getVariableUsages(
                code,
                variables.map((v) => v.name)
            );
        } catch {
            return;
        }
        const decorations = createVariableDecorations(usages);
        decorationIdRef.current = editor.deltaDecorations(
            decorationIdRef.current,
            decorations
        );
    }, []);

    return highlight;
}

function createVariableDecorations(usages) {
    return usages.map((usage) => ({
        range: {
            startLineNumber: usage.loc.start.line,
            startColumn: usage.loc.start.column + 1,
            endLineNumber: usage.loc.end.line,
            endColumn: usage.loc.end.column + 1,
        },
        options: {
            inlineClassName: "highlight-variable",
        },
    }));
}

function getVariableUsages(code, variables) {
    const ast = parse(code, { locations: true, ranges: true });
    const result = [];

    function visit(node) {
        if (!node) return;
        if (node.type === "Identifier" && variables.includes(node.name)) {
            result.push({
                name: node.name,
                loc: node.loc,
                range: node.range,
            });
        }
        for (const key in node) {
            if (node[key] && typeof node[key] === "object") {
                if (Array.isArray(node[key])) {
                    node[key].forEach(visit);
                } else {
                    visit(node[key]);
                }
            }
        }
    }
    visit(ast);
    return result;
}
