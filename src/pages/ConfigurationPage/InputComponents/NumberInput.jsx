import { memo, useState } from "react";
import {
    NumberInputField,
    NumberInputRoot,
} from "@/components/ui/number-input";
import { useVariablesStore } from "@/store/variables-store";

export const NumberInput = memo(function NumberInput(props) {
    console.log("Render NumberInput");
    const { id, targetKey, value, ...rest } = props;
    const [innerValue, setInnerValue] = useState(value);
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <NumberInputRoot
            value={innerValue}
            formatOptions={{
                style: "decimal",
                maximumFractionDigits: rest.isF ? 3 : 0,
                useGrouping: false,
            }}
            size={"xs"}
            onValueChange={(details) => {
                setInnerValue(details.value);
            }}
            onBlur={() => {
                setSettings(id, {
                    [targetKey]: rest.isF
                        ? parseFloat(innerValue)
                        : parseInt(innerValue),
                });
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setSettings(id, {
                        [targetKey]: rest.isF
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
            <NumberInputField />
        </NumberInputRoot>
    );
});
