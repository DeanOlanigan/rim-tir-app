import { useEffect, memo, useRef } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { Editor } from "@monaco-editor/react";
import { useVariablesStore } from "@/store/variables-store";
import debounce from "debounce";
import { useLuaDiagnostics } from "./useLuaDiagnostics";
import { useVariableHighlightLuaParse } from "./useVariableHighlightLuaParse";
import { useVariablesList } from "@/store/selectors";
import { validateCyclicVariable } from "@/utils/validator";

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
    const highlight = useVariableHighlightLuaParse();

    useEffect(() => {
        if (luaExpression !== undefined) {
            const editor = editorRef.current?.editor;
            const model = editorRef.current?.editor?.getModel();
            highlight(luaExpression, editor, variables);
            diagnostics(id, luaExpression, monacoRef.current, model);
            validateCyclicVariable(variables);
        }
    }, [luaExpression, highlight, diagnostics, id, variables]);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = { editor, monaco };
        monacoRef.current = monaco;
        highlight(luaExpression, editor, variables);
        diagnostics(id, luaExpression, monaco, editor.getModel());
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

    return (
        <Editor
            defaultLanguage="lua"
            value={luaExpression}
            height={height}
            width={width}
            theme={colorMode === "light" ? "vs" : "vs-dark"}
            onChange={onChangeHandler}
            onMount={handleEditorDidMount}
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
