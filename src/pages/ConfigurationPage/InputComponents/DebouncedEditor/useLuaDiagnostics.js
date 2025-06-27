import { useCallback } from "react";
import { parse } from "luaparse";

export function useLuaDiagnostics() {
    const validate = useCallback((code, monaco, model) => {
        if (!monaco || !model) return;
        try {
            parse(code, { locations: true });
            monaco.editor.setModelMarkers(model, "lua", []);
        } catch (error) {
            const line = error.line || 1;
            const col = error.column || 1;
            const message = error.message;
            const markers = [
                {
                    severity: monaco.MarkerSeverity.Error,
                    message,
                    startLineNumber: line,
                    startColumn: col,
                    endLineNumber: line,
                    endColumn: col + 1,
                },
            ];
            monaco.editor.setModelMarkers(model, "lua", markers);
        }
    }, []);
    return validate;
}
