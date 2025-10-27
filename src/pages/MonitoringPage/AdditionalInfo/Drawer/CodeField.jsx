import { useColorMode } from "@/components/ui/color-mode";
import { Stack, Text } from "@chakra-ui/react";
import { Editor, loader } from "@monaco-editor/react";
import { useEffect, useState } from "react";

import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

export const CodeField = ({ setting, config, w, h }) => {
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
    if (!ready) return null;
    const label = config.settings["luaExpression"]?.label;
    const value = setting["luaExpression"];
    return (
        <Stack w={w}>
            <Text fontWeight={"medium"}>{label}</Text>
            <Editor
                defaultLanguage="lua"
                height={h}
                value={value}
                theme={colorMode === "light" ? "vs" : "vs-dark"}
                options={{
                    readOnly: true,
                    domReadOnly: true,
                    minimap: { enabled: false },
                    overviewRulerLanes: 0,
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 0,
                    lineNumbers: "off",
                    renderLineHighlight: "none",
                    contextmenu: false,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollbar: {
                        vertical: "hidden",
                        horizontal: "hidden",
                    },
                }}
            />
        </Stack>
    );
};
