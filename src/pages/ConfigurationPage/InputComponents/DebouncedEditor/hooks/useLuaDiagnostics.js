import { validateCodeNew } from "@/utils/validation";
import { useCallback } from "react";

export function useLuaDiagnostics() {
    const validate = useCallback((ast, error, monaco, model, variables) => {
        if (!monaco || !model) return;
        const markers = validateCodeNew(ast, error, variables);
        monaco.editor.setModelMarkers(model, "lua", markers);
    }, []);
    return validate;
}
