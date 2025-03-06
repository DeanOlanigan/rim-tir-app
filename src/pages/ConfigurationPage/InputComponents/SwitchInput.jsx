import { Field } from "../../../components/ui/field";
import { Switch } from "../../../components/ui/switch";
import { useVariablesStore } from "../../../store/variables-store";
import { memo } from "react";

export const SwitchInput = memo(function SwitchInput(props) {
    const { targetKey, id, value, label, showLabel = false } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);

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
