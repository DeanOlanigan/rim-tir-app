import { memo, useEffect, useState } from "react";
import { useVariablesStore } from "@/store/variables-store";
import { NumberInput as ChakraNumberInput, InputGroup } from "@chakra-ui/react";
import { ErrorSign } from "./ErrorSign";

export const NumberInput = memo(function NumberInput(props) {
    console.log("Render NumberInput");
    const { id, targetkey, value, errors, isF, ...rest } = props;
    const [innerValue, setInnerValue] = useState(value);
    const setSettings = useVariablesStore((state) => state.setSettings);

    useEffect(() => {
        setInnerValue(value);
    }, [value]);

    return (
        <ChakraNumberInput.Root
            w={"100%"}
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
                const res = isF
                    ? parseFloat(innerValue).toFixed(3)
                    : parseInt(innerValue);
                if (res === value) return;
                setSettings(id, {
                    [targetkey]: res,
                });
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setSettings(id, {
                        [targetkey]: isF
                            ? parseFloat(innerValue)
                            : parseInt(innerValue),
                    });
                }
                if (e.key === "Escape") {
                    setInnerValue(value);
                }
            }}
            onClick={(e) => e.stopPropagation()}
            {...rest}
        >
            <ChakraNumberInput.Control />
            <InputGroup
                endElement={
                    errors && errors.size !== 0 && <ErrorSign errors={errors} />
                }
                endElementProps={{ me: "4" }}
            >
                <ChakraNumberInput.Input />
            </InputGroup>
        </ChakraNumberInput.Root>
    );
});
