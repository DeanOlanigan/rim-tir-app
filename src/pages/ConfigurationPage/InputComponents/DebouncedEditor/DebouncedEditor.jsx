import { useEffect, memo, useRef, useState } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { Editor, loader } from "@monaco-editor/react";
import { useVariablesStore } from "@/store/variables-store";
import debounce from "debounce";
import { getVarDataStore } from "@/utils/validation";
import { luaAstParse } from "@/utils/validation";
import { getCompletionSnippets } from "./snippets";

import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

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
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let alive = true;

        if (typeof window !== "undefined") {
            self.MonacoEnvironment = {
                getWorker() {
                    return new EditorWorker();
                },
            };
        }

        (async () => {
            const monaco = await import(
                "monaco-editor/esm/vs/editor/editor.api"
            );
            await Promise.all([
                import(
                    "monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController"
                ),
                import(
                    "monaco-editor/esm/vs/editor/contrib/snippet/browser/snippetController2"
                ),
                import(
                    "monaco-editor/esm/vs/editor/contrib/suggest/browser/suggest"
                ),
                import(
                    "monaco-editor/esm/vs/basic-languages/lua/lua.contribution"
                ),
            ]);
            loader.config({ monaco });
            await loader.init();
            if (alive) setReady(true);
        })();
        return () => {
            alive = false;
        };
    }, []);

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
    if (!ready) return null;

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
