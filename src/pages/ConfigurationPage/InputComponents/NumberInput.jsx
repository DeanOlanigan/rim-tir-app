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
            size={"xs"}
            onValueChange={(details) => {
                setInnerValue(details.value);
            }}
            onBlur={() => {
                setSettings(id, {
                    [targetKey]: innerValue,
                });
            }}
            onClick={(e) => e.stopPropagation()}
            {...rest}
        >
            <NumberInputField />
        </NumberInputRoot>
    );
});
