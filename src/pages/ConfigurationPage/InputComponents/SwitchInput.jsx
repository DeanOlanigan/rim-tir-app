import { Field } from "../../../components/ui/field";
import { Switch } from "../../../components/ui/switch";
import { useVariablesStore } from "../../../store/variables-store";
import { memo } from "react";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";

export const SwitchInput = memo(function SwitchInput(props) {
    const { targetKey, id, value, showLabel = false } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    const label = PARAM_DEFINITIONS[targetKey].label;

    return (
        <Field label={showLabel ? label : ""} w={"fit"}>
            <Switch
                size={"lg"}
                checked={Boolean(value)}
                onCheckedChange={(e) => {
                    setSettings(id, {
                        [targetKey]: e.checked,
                    });
                }}
            >
                {!showLabel ? label : ""}
            </Switch>
        </Field>
    );
});
