import { memo } from "react";
import { useVariablesStore } from "../../../store/variables-store";
import { useMaskito } from "@maskito/react";
import { Field } from "../../../components/ui/field";
import { Input } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";

export const HexInput = memo(function HexInput(props) {
    const { targetKey, id, value, showLabel = false, label } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);

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

    const inputRef = useMaskito({ options: hexMask });

    return (
        <Field
            label={
                showLabel ? label || PARAM_DEFINITIONS[targetKey]?.label : ""
            }
        >
            <Input
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
            />
        </Field>
    );
});
