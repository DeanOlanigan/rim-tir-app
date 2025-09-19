import { useEffect, memo, useRef } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { Editor } from "@monaco-editor/react";
import { useVariablesStore } from "@/store/variables-store";
import debounce from "debounce";
import { getVarDataStore } from "@/utils/validation";
import { luaAstParse } from "@/utils/validation";
import { getCompletionSnippets } from "./snippets";

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

export const DebouncedEditor = memo(function DebouncedEditor({
    luaExpression,
    id,
    height,
    width,
}) {
    const { colorMode } = useColorMode();
    const { setSettings, settings } = useVariablesStore.getState();
    const { varIdsByName } = getVarDataStore(settings);
    const debounced = debounce((id, newCode) => {
        setSettings(id, { luaExpression: newCode });
    }, 500);

    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const providerRef = useRef(null);
    const decorationIdRef = useRef([]);

    useEffect(() => {
        if (!editorRef.current || !monacoRef.current) return;
        const { markers, varsToHighlight } = luaAstParse(
            luaExpression,
            varIdsByName,
            id
        );
        monacoRef.current.editor.setModelMarkers(
            editorRef.current.getModel(),
            "lua",
            markers
        );
        decorationIdRef.current = editorRef.current.deltaDecorations(
            decorationIdRef.current,
            createVariableDecorations(varsToHighlight)
        );
    }, [luaExpression, varIdsByName, id]);

    useEffect(() => {
        return () => {
            if (providerRef.current) {
                providerRef.current.dispose();
                providerRef.current = null;
            }
            if (editorRef.current && decorationIdRef.current.length > 0) {
                editorRef.current.deltaDecorations(decorationIdRef.current, []);
                decorationIdRef.current = [];
            }
            debounced.clear();
        };
    }, [debounced]);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;
        providerRef.current = getCompletionSnippets(monacoRef);

        const code = editor.getValue();
        const { markers, varsToHighlight } = luaAstParse(
            code,
            varIdsByName,
            id
        );
        monaco.editor.setModelMarkers(editor.getModel(), "lua", markers);
        decorationIdRef.current = editor.deltaDecorations(
            decorationIdRef.current,
            createVariableDecorations(varsToHighlight)
        );
    }

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
