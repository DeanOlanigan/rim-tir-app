import { memo, useEffect, useState } from "react";
import { useVariablesStore } from "@/store/variables-store";
import { NumberInput as ChakraNumberInput } from "@chakra-ui/react";

export const NumberInput = memo(function NumberInput(props) {
    console.log("Render NumberInput");
    const { id, targetKey, value, isF } = props;
    const [innerValue, setInnerValue] = useState(value);
    const setSettings = useVariablesStore((state) => state.setSettings);

    useEffect(() => {
        setInnerValue(value);
    }, [value]);

    return (
        <ChakraNumberInput.Root
            size={"xs"}
            value={innerValue}
            // BUG Chakra update breaks NumberInput format options
            /* formatOptions={{
                style: "decimal",
                maximumFractionDigits: isF ? 3 : 0,
                useGrouping: false,
            }} */
            onValueChange={(details) => {
                setInnerValue(details.value);
            }}
            onBlur={() => {
                setSettings(id, {
                    [targetKey]: isF
                        ? parseFloat(innerValue).toFixed(3)
                        : parseInt(innerValue),
                });
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setSettings(id, {
                        [targetKey]: isF
                            ? parseFloat(innerValue)
                            : parseInt(innerValue),
                    });
                }
                if (e.key === "Escape") {
                    setInnerValue(value);
                }
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <ChakraNumberInput.Control />
            <ChakraNumberInput.Input />
        </ChakraNumberInput.Root>
    );
});
