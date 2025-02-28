import {
    NumberInputField,
    NumberInputRoot,
} from "../../../../../components/ui/number-input";
import { useVariablesStore } from "../../../../../store/variables-store";
import { memo } from "react";

export const CycleDelayCell = memo(function CycleDelayCell({
    isSpecial,
    specialCycleDelay,
    id,
}) {
    console.log("Render CycleDelayCell");
    const setSettings = useVariablesStore((state) => state.setSettings);

    if (!isSpecial) {
        return null;
    }

    return (
        <NumberInputRoot
            value={specialCycleDelay}
            size={"xs"}
            onValueChange={(data) => {
                setSettings(id, {
                    specialCycleDelay: data.value,
                });
            }}
        >
            <NumberInputField />
        </NumberInputRoot>
    );
});
