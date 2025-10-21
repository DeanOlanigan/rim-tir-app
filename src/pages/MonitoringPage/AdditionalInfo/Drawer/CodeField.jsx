import { useColorMode } from "@/components/ui/color-mode";
import { Stack, Text } from "@chakra-ui/react";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
loader.config({ monaco });

export const CodeField = ({ setting, config, w, h }) => {
    const { colorMode } = useColorMode();
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
