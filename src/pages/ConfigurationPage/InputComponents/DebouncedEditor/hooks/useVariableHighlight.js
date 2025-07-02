import { useCallback, useRef } from "react";

export const useVariableHighlight = () => {
    const decorationIdRef = useRef([]);

    const highlight = useCallback((code, editor, variables) => {
        if (!editor || !code) return;
        const decorations = [];
        const lines = code?.split("\n");

        variables.items.forEach((v) => {
            const regex = new RegExp(`\\b${v.value}\\b`, "g");
            lines.forEach((line, i) => {
                let match;
                while ((match = regex.exec(line)) !== null) {
                    decorations.push({
                        range: {
                            startLineNumber: i + 1,
                            startColumn: match.index + 1,
                            endLineNumber: i + 1,
                            endColumn: match.index + v.value.length + 1,
                        },
                        options: {
                            inlineClassName: "highlight-variable",
                        },
                    });
                }
            });
        });

        decorationIdRef.current = editor.deltaDecorations(
            decorationIdRef.current,
            decorations
        );
    }, []);

    return highlight;
};
