import { validateCode } from "@/utils/validation";
import { useCallback } from "react";

export function useLuaDiagnostics() {
    const validate = useCallback((ast, error, monaco, model) => {
        if (!monaco || !model) return;
        const markers = validateCode(ast, error);
        monaco.editor.setModelMarkers(model, "lua", markers);
    }, []);
    return validate;
}
