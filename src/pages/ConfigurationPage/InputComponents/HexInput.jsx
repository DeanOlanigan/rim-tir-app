import { memo } from "react";
import { useVariablesStore } from "@/store/variables-store";
import { useMaskito } from "@maskito/react";
import { Input } from "@chakra-ui/react";

const hexMask = {
    mask: /^[0-9]*$|^0x[0-9a-fA-F]*$/,
    postprocessors: [
        ({ value, selection }) => {
            // Приводим HEX к верхнему регистру для визуального удобства
            if (value.startsWith("0x")) {
                value = value.slice(0, 2) + value.slice(2).toUpperCase();
            }
            return { value, selection };
        },
    ],
};

export const HexInput = memo(function HexInput(props) {
    console.log("Render HexInput");
    const { id, targetKey, value, ...rest } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);

    const inputRef = useMaskito({ options: hexMask });

    return (
        <Input
            autoComplete="off"
            ref={inputRef}
            maxLength={6}
            size={"xs"}
            maxW={"250px"}
            value={value}
            onInput={(e) => {
                setSettings(id, {
                    [targetKey]: e.target.value,
                });
            }}
            {...rest}
        />
    );
});
