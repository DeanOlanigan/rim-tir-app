import { useCallback, useEffect, useState, memo } from "react";
import { useColorMode } from "../../../components/ui/color-mode";
import { Editor } from "@monaco-editor/react";
import { useVariablesStore } from "../../../store/variables-store";
import debounce from "debounce";

export const DebouncedEditor = memo(function DebouncedEditor(props) {
    const { luaExpression, id, height, width } = props;
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
            height={height}
            width={width}
            theme={colorMode === "light" ? "vs" : "vs-dark"}
            onChange={(value) => {
                setValue(value);
                debounced({ id, luaExpression: value });
            }}
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
    );
});
