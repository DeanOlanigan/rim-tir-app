import { memo } from "react";
import { Field } from "@chakra-ui/react";
import {
    NumberInputField,
    NumberInputRoot,
} from "@/components/ui/number-input";
import { useVariablesStore } from "@/store/variables-store";
import { PARAM_DEFINITIONS } from "@/config/paramDefinitions";

export const NumberInput = memo(function NumberInput(props) {
    const {
        targetKey,
        id,
        value,
        showLabel = false,
        errorText,
        ...rest
    } = props;
    const label = PARAM_DEFINITIONS[targetKey].label;

    //console.log("Render NumberInput");
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <Field.Root maxW={"250px"} invalid={errorText && errorText.length > 0}>
            {showLabel && <Field.Label>{label || ""}</Field.Label>}
            <NumberInputRoot
                value={value}
                size={"xs"}
                onValueChange={(details) => {
                    setSettings(id, {
                        [targetKey]: details.value,
                    });
                }}
                {...rest}
            >
                <NumberInputField />
            </NumberInputRoot>
            {errorText &&
                errorText.length > 0 &&
                errorText.map((error, index) => (
                    <Field.ErrorText key={index}>{error}</Field.ErrorText>
                ))}
        </Field.Root>
    );
});
