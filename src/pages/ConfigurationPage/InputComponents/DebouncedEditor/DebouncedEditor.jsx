import { useEffect, memo, useRef } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { Editor } from "@monaco-editor/react";
import { useVariablesStore } from "@/store/variables-store";
import debounce from "debounce";
import { useLuaDiagnostics } from "./hooks/useLuaDiagnostics";
import { useVariableHighlightLuaParse } from "./hooks/useVariableHighlightLuaParse";
import { useVariablesList } from "@/store/selectors";
import { setLuaCodeError, validateCyclicVariable } from "@/utils/validator";
import { luaAstParse } from "./luaAstParser";

export const DebouncedEditor = memo(function DebouncedEditor({
    luaExpression,
    id,
    height,
    width,
}) {
    const { colorMode } = useColorMode();
    const setSettings = useVariablesStore.getState().setSettings;
    const variables = useVariablesList();

    const editorRef = useRef(null);
    const monacoRef = useRef(null);

    const diagnostics = useLuaDiagnostics();
    const highlight = useVariableHighlightLuaParse(editorRef.current);

    useEffect(() => {
        if (luaExpression !== undefined) {
            const editor = editorRef.current;
            const model = editorRef.current?.getModel();
            const { ast, error } = luaAstParse(luaExpression);
            if (ast) highlight(ast, editor, variables);
            diagnostics(ast, error, monacoRef.current, model);
            validateCyclicVariable(variables);
        }
    }, [luaExpression, highlight, diagnostics, variables]);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;
        const code = editor.getValue();
        const { ast, error } = luaAstParse(code);
        if (ast) highlight(ast, editor, variables);
        diagnostics(ast, error, monaco, editor.getModel());
    }

    const debounced = useRef(
        debounce((id, newCode) => {
            setSettings(id, {
                luaExpression: newCode,
            });
        }, 500)
    ).current;

    const onChangeHandler = (value) => {
        debounced(id, value);
    };

    const handleValidate = (markers) => {
        setLuaCodeError(
            id,
            markers.map((m) => m.message)
        );
    };

    return (
        <Editor
            defaultLanguage="lua"
            value={luaExpression}
            height={height}
            width={width}
            theme={colorMode === "light" ? "vs" : "vs-dark"}
            onChange={onChangeHandler}
            onMount={handleEditorDidMount}
            onValidate={handleValidate}
            options={{
                minimap: { enabled: false },
                lineNumbers: "on",
                renderLineHighlight: "all",
                contextmenu: false,
                scrollBeyondLastLine: false,
                scrollbar: {
                    vertical: "hidden",
                    horizontal: "hidden",
                },
            }}
        />
    );
});
