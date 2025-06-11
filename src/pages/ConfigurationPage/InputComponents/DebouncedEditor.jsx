import { useCallback, useEffect, useState, memo, useRef } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { Editor } from "@monaco-editor/react";
import { useVariablesStore } from "@/store/variables-store";
import debounce from "debounce";
import { Box } from "@chakra-ui/react";
import { load } from "fengari-web";
import { useVariablesOptions } from "@/hooks/useVariablesOptions";

function validateLua(code) {
    try {
        load(code);
        return [];
    } catch (error) {
        const regex = /^\[string.*\]:(\d+): (.+)$/;
        const match = error.message.match(regex);
        if (match) {
            const line = Number(match[1]);
            const message = match[2];
            let startColumn = 1;
            let endColumn = 1;
            const nearMatch = message.match(/near '([^']+)'/);
            if (nearMatch) {
                // Берём нужную строку кода
                const lines = code.split("\n");
                const lineText = lines[line - 1] || "";
                const idx = lineText.indexOf(nearMatch[1]);
                if (idx !== -1) {
                    startColumn = idx + 1;
                    endColumn = idx + nearMatch[1].length + 1;
                } else {
                    // Если не нашли, подсвечиваем всю строку
                    startColumn = 1;
                    endColumn = lineText.length + 1;
                }
            } else {
                // Нет near — подсвечиваем всю строку
                const lines = code.split("\n");
                const lineText = lines[line - 1] || "";
                endColumn = lineText.length + 1;
            }
            return [
                {
                    severity: 8,
                    message,
                    startLineNumber: line,
                    startColumn,
                    endLineNumber: line,
                    endColumn,
                },
            ];
        }
        return [
            {
                severity: 8,
                message: error.message,
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 1,
                endColumn: 1,
            },
        ];
    }
}

export const DebouncedEditor = memo(function DebouncedEditor(props) {
    const { luaExpression, id, height, width } = props;
    const { colorMode } = useColorMode();
    const modelRef = useRef(null);
    const monacoRef = useRef(null);
    const variables = useVariablesOptions();
    console.log(variables.items.map((v) => v.value));

    function handleEditorDidMount(editor, monaco) {
        console.log(editor, monaco);
        modelRef.current = editor;
        monacoRef.current = monaco;
        highlightVariables(editor, luaExpression);
    }

    function handleValidate(code) {
        const model = modelRef.current.getModel();
        if (!monacoRef.current || !model) return;
        const markers = validateLua(code);
        monacoRef.current.editor.setModelMarkers(model, "owner", markers);
        console.log("handleValidate");
    }

    const setSettings = useVariablesStore((state) => state.setSettings);
    const [value, setValue] = useState(luaExpression);

    useEffect(() => {
        setValue(luaExpression);
    }, [luaExpression]);

    const debounced = useCallback(
        debounce((data) => {
            setSettings(data.id, {
                luaExpression: data.luaExpression,
            });
            handleValidate(data.luaExpression);
            highlightVariables(modelRef.current, data.luaExpression);
        }, 500),
        []
    );

    function highlightVariables(editor, code) {
        if (!editor) return;
        const decorations = [];
        const lines = code.split("\n");
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
        editor.deltaDecorations([], decorations);
    }

    return (
        <>
            {/* <Box
                h={height || "100%"}
                w={width || "100%"}
                border={"1px solid"}
                borderColor={"border"}
                borderRadius={"md"}
                overflow={"clip"}
                shadow={"md"}
            > */}
            <style>
                {`
                    .highlight-variable {
                    background-color: #ffd54f;
                    border-bottom: 2px solid #ffa000;
                    border-radius: 3px;
                    }
                `}
            </style>
            <Editor
                defaultLanguage="lua"
                value={value}
                height={height}
                width={width}
                theme={colorMode === "light" ? "vs" : "vs-dark"}
                onChange={(value) => {
                    setValue(value);
                    debounced({ id, luaExpression: value });
                }}
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
            {/* </Box> */}
        </>
    );
});
