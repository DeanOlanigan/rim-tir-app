import { memo } from "react";
import { Field } from "../../../components/ui/field";
import {
    NumberInputField,
    NumberInputRoot,
} from "../../../components/ui/number-input";
import { useVariablesStore } from "../../../store/variables-store";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";

export const NumberInput = memo(function NumberInput(props) {
    const { targetKey, id, value, showLabel = false } = props;
    const label = PARAM_DEFINITIONS[targetKey].label;

    //console.log("Render NumberInput");
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <Field label={showLabel ? label : ""} maxW={"250px"}>
            <NumberInputRoot
                value={value}
                size={"xs"}
                onValueChange={(details) => {
                    setSettings(id, {
                        [targetKey]: details.value,
                    });
                }}
            >
                <NumberInputField />
            </NumberInputRoot>
        </Field>
    );
});
