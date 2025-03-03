import { useCallback, useEffect, useState, memo } from "react";
import { useColorMode } from "../../../../components/ui/color-mode";
import { Editor } from "@monaco-editor/react";
import { useVariablesStore } from "../../../../store/variables-store";
import debounce from "debounce";

export const DebouncedEditor = memo(function DebouncedEditor({
    luaExpression,
    id,
}) {
    const { colorMode } = useColorMode();
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
        }, 500),
        []
    );

    return (
        <Editor
            defaultLanguage="lua"
            value={value}
            theme={colorMode === "light" ? "vs" : "vs-dark"}
            onChange={(value) => {
                setValue(value);
                debounced({ id, luaExpression: value });
            }}
        />
    );
});
