import { useCallback, useEffect, useState, memo, useRef } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { Editor } from "@monaco-editor/react";
import { useVariablesStore } from "@/store/variables-store";
import debounce from "debounce";
import { useVariablesOptions } from "@/hooks/useVariablesOptions";
import { useLuaDiagnostics } from "./useLuaDiagnostics";
import { useVariableHighlight } from "./useVariableHighlight";
import { useCyclicDepsFinder } from "./useCyclicDepsFinder";
import { useVariableHighlightLuaParse } from "./useVariableHighlightLuaParse";

export const DebouncedEditor = memo(function DebouncedEditor({
    luaExpression,
    id,
    height,
    width,
}) {
    const { colorMode } = useColorMode();
    const setSettings = useVariablesStore.getState().setSettings;
    const variables = useVariablesOptions();

    const editorRef = useRef(null);
    const monacoRef = useRef(null);

    const [innerValue, setInnerValue] = useState(luaExpression);

    const model = editorRef.current?.editor?.getModel();
    const editor = editorRef.current?.editor;
    const diagnostics = useLuaDiagnostics();
    const highlight = useVariableHighlightLuaParse();
    // TODO Вынести поиск цикличных зависимостей из редактора на уровень состояния,
    // т.к. если переименовать узел из контекстного меню, то циклические зависимости не обновятся
    const findCyclic = useCyclicDepsFinder();

    useEffect(() => {
        setInnerValue(luaExpression);
    }, [luaExpression]);

    useEffect(() => {
        if (innerValue !== undefined) {
            highlight(innerValue, editor, variables);
            diagnostics(innerValue, monacoRef.current, model);
        }
    }, [innerValue, highlight, diagnostics, editor, variables, model]);

    useEffect(() => {
        findCyclic(id);
    }, [variables, findCyclic, id]);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = { editor, monaco };
        monacoRef.current = monaco;
        highlight(luaExpression, editor, variables);
        diagnostics(luaExpression, monaco, editor.getModel());
    }

    const debounced = useCallback(
        debounce((newCode) => {
            setSettings(id, {
                luaExpression: newCode,
            });
            findCyclic(id);
        }, 500),
        [id, setSettings]
    );

    const onChangeHandler = (value) => {
        setInnerValue(value);
        debounced(value);
    };

    return (
        <Editor
            defaultLanguage="lua"
            value={innerValue}
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
