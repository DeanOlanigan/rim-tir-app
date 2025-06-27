import { useCallback, useEffect, useState, memo, useRef } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { Editor } from "@monaco-editor/react";
import { useVariablesStore } from "@/store/variables-store";
import debounce from "debounce";
import { load } from "fengari-web";
import { useVariablesOptions } from "@/hooks/useVariablesOptions";

function useLuaDiagnostics(monaco, model) {
    const validate = useCallback(
        (code) => {
            if (!monaco || !model) return;
            try {
                load(code);
                monaco.editor.setModelMarkers(model, "lua", []);
            } catch (error) {
                const regex = /^\[string.*\]:(\d+): (.+)$/;
                const match = error.message.match(regex);
                let markers = [];
                let line = 1;
                let message = error.message;
                if (match) {
                    line = Number(match[1]);
                    message = match[2];
                }
                const lines = code?.split("\n") || [];
                const text = lines[line - 1] || "";
                let startColumn = 1;
                let endColumn = text.length + 1;
                const nearMatch = message.match(/near '([^']+)'/);
                if (nearMatch) {
                    const token = nearMatch[1];
                    const idx = text.indexOf(token);
                    if (idx >= 0) {
                        startColumn = idx + 1;
                        endColumn = startColumn + token.length;
                    }
                }
                markers.push({
                    severity: monaco.MarkerSeverity.Error,
                    message,
                    startLineNumber: line,
                    startColumn,
                    endLineNumber: line,
                    endColumn,
                });
                monaco.editor.setModelMarkers(model, "lua", markers);
            }
        },
        [monaco, model]
    );

    useEffect(() => {
        if (model) {
            const currentCode = model.getValue();
            validate(currentCode);
        }
    }, [model, validate]);

    return validate;
}

const useVariableHighlight = (editor, variables) => {
    const decorationIdRef = useRef([]);

    const highlight = useCallback(
        (code) => {
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
        },
        [editor, variables]
    );

    useEffect(() => {
        return () => {
            if (editor && decorationIdRef.current.length) {
                editor.deltaDecorations(decorationIdRef.current, []);
            }
        };
    }, [editor]);

    return highlight;
};

export const DebouncedEditor = memo(function DebouncedEditor({
    luaExpression,
    id,
    height,
    width,
}) {
    const { colorMode } = useColorMode();
    const setSettings = useVariablesStore((state) => state.setSettings);
    const variables = useVariablesOptions();

    const editorRef = useRef(null);
    const monacoRef = useRef(null);

    const [value, setValue] = useState(luaExpression);

    const model = editorRef.current?.editor?.getModel();
    const diagnostics = useLuaDiagnostics(monacoRef.current, model);
    const highlight = useVariableHighlight(
        editorRef.current?.editor,
        variables
    );

    useEffect(() => {
        setValue(luaExpression);
        highlight(luaExpression);
        diagnostics(luaExpression);
    }, [luaExpression, highlight, diagnostics]);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = { editor, monaco };
        monacoRef.current = monaco;
    }

    const debounced = useCallback(
        debounce((newCode) => {
            setSettings(id, {
                luaExpression: newCode,
            });
        }, 500),
        [id, setSettings, diagnostics, highlight]
    );

    const onChangeHandler = (value) => {
        setValue(value);
        debounced(value);
        highlight(value);
        diagnostics(value);
    };

    return (
        <>
            <style>
                {
                    ".highlight-variable {color:rgb(211, 1, 1); font-weight: bold}"
                }
            </style>
            <Editor
                defaultLanguage="lua"
                value={value}
                height={height}
                width={width}
                theme={colorMode === "light" ? "vs" : "vs-dark"}
                onChange={onChangeHandler}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false }, // скрыть мини-карту
                    lineNumbers: "on", // отключить нумерацию строк
                    renderLineHighlight: "none", // убрать подсветку текущей строки
                    contextmenu: false, // отключить контекстное меню
                    scrollBeyondLastLine: false, // чтобы не было лишнего прокручивания
                    scrollbar: {
                        vertical: "hidden", // скрыть вертикальный скролл
                        horizontal: "hidden", // скрыть горизонтальный скролл
                    },
                }}
            />
        </>
    );
});
