import { useEffect, memo, useRef } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { Editor } from "@monaco-editor/react";
import { useVariablesStore } from "@/store/variables-store";
import debounce from "debounce";
import { useVariableHighlightLuaParse } from "./hooks/useVariableHighlightLuaParse";
import { getVarIdsByName, useVariablesNames } from "@/store/selectors";
import { ErrorDraft, setLuaCodeError } from "@/utils/validation";
import { luaAstParse } from "@/utils/validation";
import { getCompletionSnippets } from "./snippets";
import { useValidationStore } from "@/store/validation-store";
import { tarjanCyclicDeps } from "@/utils/validation/engines/luaValidationService/tarjan";

export const DebouncedEditor = memo(function DebouncedEditor({
    luaExpression,
    id,
    height,
    width,
}) {
    const { colorMode } = useColorMode();
    const setSettings = useVariablesStore.getState().setSettings;
    const varNames = useVariablesNames();

    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const providerRef = useRef(null);

    const highlight = useVariableHighlightLuaParse(editorRef.current);

    useEffect(() => {
        if (!luaExpression || !editorRef.current || !monacoRef.current) return;
        const editor = editorRef.current;
        const model = editorRef.current?.getModel();
        const variables = getVarIdsByName();
        console.log("VARS IN USE EFFECT", variables, editor, model);

        const { markers, varsToHighlight, varsToCheckCycle } = luaAstParse(
            luaExpression,
            variables
        );
        if (monacoRef.current?.editor && model) {
            monacoRef.current.editor.setModelMarkers(model, "lua", markers);
        }
        highlight(varsToHighlight, editor);

        const depGraphById = {};
        for (const rName of varsToCheckCycle) {
            const targets = variables.get(rName) ?? [];
            const n = targets.size;
            if (n === 1) {
                const [targetId] = targets;
                if (!depGraphById[id]) depGraphById[id] = new Set();
                depGraphById[id].add(targetId);
            }
        }

        const draft = new ErrorDraft();
        const tarjan = tarjanCyclicDeps(depGraphById);
        console.log(depGraphById, varsToCheckCycle, tarjan);
        for (const [nodeId, scc] of Object.entries(tarjan)) {
            let msg = [];
            if (scc) {
                const names = scc.map((v) => variables.get(v)).join("->");
                msg = [`Обнаружена циклическая зависимость: ${names}`];
            }
            draft.set(nodeId, "name", "cyclic", msg);
        }

        /* const draft = validateCyclicVariable({ variables });
        useValidationStore.getState().applyDraft2(draft); */
    }, [luaExpression, varNames, id, highlight]);

    useEffect(() => {
        return () => {
            if (providerRef.current) {
                providerRef.current.dispose();
                providerRef.current = null;
            }
        };
    }, []);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;

        if (providerRef.current) {
            providerRef.current.dispose();
            providerRef.current = null;
        }

        providerRef.current = getCompletionSnippets(monacoRef);

        const variables = getVarIdsByName();
        console.log("VARS ON MOUNT", variables, editor, monaco);
        const code = editor.getValue();
        const { markers, varsToHighlight } = luaAstParse(code, variables);
        monaco.editor.setModelMarkers(editor.getModel(), "lua", markers);
        highlight(varsToHighlight, editor);
    }

    const debounced = useRef(
        debounce((id, newCode) => {
            setSettings(
                id,
                {
                    luaExpression: newCode,
                },
                false
            );
        }, 500)
    ).current;

    const onChangeHandler = (value) => {
        debounced(id, value);
    };

    const handleValidate = (markers) => {
        const draft = setLuaCodeError(
            id,
            markers.map((m) => m.message)
        );
        useValidationStore.getState().applyDraft2(draft);
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
