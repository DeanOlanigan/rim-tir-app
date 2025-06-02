import { memo } from "react";
import {
    NumberInputField,
    NumberInputRoot,
} from "@/components/ui/number-input";
import { useVariablesStore } from "@/store/variables-store";

export const NumberInput = memo(function NumberInput(props) {
    console.log("Render NumberInput");
    const { id, targetKey, value, ...rest } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <NumberInputRoot
            value={value}
            size={"xs"}
            onValueChange={(details) => {
                setSettings(id, {
                    [targetKey]: details.value,
                });
            }}
            onClick={(e) => e.stopPropagation()}
            {...rest}
        >
            <NumberInputField />
        </NumberInputRoot>
    );
});
