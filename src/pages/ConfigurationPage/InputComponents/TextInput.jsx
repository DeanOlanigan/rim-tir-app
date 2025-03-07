import { memo } from "react";
import { Field } from "../../../components/ui/field";
import { Input } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";
import { useVariablesStore } from "../../../store/variables-store";

export const TextInput = memo(function TextInput(props) {
    const { targetKey, id, value, showLabel = false } = props;
    const label = PARAM_DEFINITIONS[targetKey].label;

    console.log("Render TextInput");
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <Field label={showLabel ? label : ""}>
            <Input
                size={"xs"}
                value={value}
                onChange={(e) => {
                    setSettings(id, {
                        [targetKey]: e.target.value,
                    });
                }}
            />
        </Field>
    );
});
