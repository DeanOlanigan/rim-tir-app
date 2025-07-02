import { useCallback, useEffect, useRef } from "react";

export function useVariableHighlightLuaParse(editor) {
    const decorationIdRef = useRef([]);

    const highlight = useCallback((ast, editor, variables) => {
        if (!editor || !ast) return;
        let usages;
        usages = getVariableUsages(
            ast,
            variables.map((v) => v.name)
        );
        const decorations = createVariableDecorations(usages);
        decorationIdRef.current = editor.deltaDecorations(
            decorationIdRef.current,
            decorations
        );
    }, []);

    useEffect(() => {
        return () => {
            if (editor && decorationIdRef.current.length > 0) {
                editor.deltaDecorations(decorationIdRef.current, []);
                decorationIdRef.current = [];
            }
        };
    }, [editor]);

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

function getVariableUsages(ast, variables) {
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
