import { useEffect, memo, useRef } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { Editor, loader } from "@monaco-editor/react";
import { useVariablesStore } from "@/store/variables-store";
import debounce from "debounce";
import { getVarDataStore } from "@/utils/validation";
import { luaAstParse } from "@/utils/validation";
import { getCompletionSnippets } from "./snippets";
import * as monaco from "monaco-editor";
loader.config({ monaco });

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

    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const providerRef = useRef(null);
    const decorationIdRef = useRef([]);

    const debounceRef = useRef();
    if (!debounceRef.current) {
        debounceRef.current = debounce((id, newCode) => {
            setSettings(id, { luaExpression: newCode });
        }, 500);
    }
    const debounced = debounceRef.current;

    useEffect(() => {
        if (!editorRef.current || !monacoRef.current) return;
        const model = editorRef.current.getModel();
        if (!model) return;

        const { markers, varsToHighlight } = luaAstParse(
            luaExpression,
            varIdsByName,
            id
        );
        monacoRef.current.editor.setModelMarkers(model, "lua", markers);
        decorationIdRef.current = editorRef.current.deltaDecorations(
            decorationIdRef.current,
            createVariableDecorations(varsToHighlight)
        );
    }, [luaExpression, varIdsByName, id]);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;

        editor.onKeyDown((e) => {
            const isF1 = e.keyCode === monaco.KeyCode.F1;

            if (isF1) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        providerRef.current?.dispose?.();
        providerRef.current = getCompletionSnippets(monaco);

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

    useEffect(() => {
        return () => {
            providerRef.current?.dispose?.();
            providerRef.current = null;

            if (editorRef.current && decorationIdRef.current.length > 0) {
                editorRef.current.deltaDecorations(decorationIdRef.current, []);
                decorationIdRef.current = [];
            }

            debounceRef.current?.clear?.();
        };
    }, []);

    const onChangeHandler = (value) => {
        debounced(id, value);
    };

    return (
        <Editor
            defaultLanguage="lua"
            path={`${id}.lua`}
            keepCurrentModel={true}
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
                quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: true,
                },
                suggestOnTriggerCharacters: true,
                wordBasedSuggestions: true,
                snippetSuggestions: "top",
                suggest: { showSnippets: true },
            }}
        />
    );
});
