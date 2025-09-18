import { useEffect, memo, useRef } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { Editor } from "@monaco-editor/react";
import { useVariablesStore } from "@/store/variables-store";
import debounce from "debounce";
import { useVariableHighlightLuaParse } from "./hooks/useVariableHighlightLuaParse";
import { getVarData, useVariablesNames } from "@/store/selectors";
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
        const t0 = performance.now();
        if (!editorRef.current || !monacoRef.current) return;
        const editor = editorRef.current;
        const model = editorRef.current?.getModel();
        const { varIdsByName, varNameById, variables } = getVarData();
        const depGraphById = {};

        let nodeMarkers, nodeVarsToHighlight;
        for (const node of variables.values()) {
            const expr = node.setting?.luaExpression;
            if (!expr) continue;
            const nodeId = node.id;
            const { markers, varsToHighlight, varsToCheckCycle } = luaAstParse(
                expr,
                varIdsByName
            );
            for (const rName of varsToCheckCycle) {
                if (!rName) continue;
                const targets = varIdsByName.get(rName) ?? new Set();
                if (targets.size === 1) {
                    const [targetId] = targets;
                    if (!depGraphById[nodeId]) depGraphById[nodeId] = new Set();
                    depGraphById[nodeId].add(targetId);
                }
            }
            if (nodeId === id) {
                nodeMarkers = markers;
                nodeVarsToHighlight = varsToHighlight;
            }
        }

        const draft = new ErrorDraft();
        const tarjan = tarjanCyclicDeps(depGraphById);
        for (const [nodeId, scc] of Object.entries(tarjan)) {
            let msg = [];
            if (scc) {
                const names = scc.map((v) => varNameById.get(v)).join("->");
                msg = [`Обнаружена циклическая зависимость: ${names}`];
            }
            draft.set(nodeId, "name", "cyclic", msg);
        }
        useValidationStore.getState().applyDraft2(draft);

        if (monacoRef.current?.editor && model) {
            monacoRef.current.editor.setModelMarkers(
                model,
                "lua",
                nodeMarkers ?? []
            );
        }
        highlight(nodeVarsToHighlight ?? [], editor);
        console.log("EFFECT PERF", performance.now() - t0);
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

        const { varIdsByName } = getVarData();
        const code = editor.getValue();
        const { markers, varsToHighlight } = luaAstParse(code, varIdsByName);
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
