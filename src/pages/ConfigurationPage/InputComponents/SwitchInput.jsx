import { Switch } from "@/components/ui/switch";
import { useVariablesStore } from "@/store/variables-store";
import { memo } from "react";

export const SwitchInput = memo(function SwitchInput(props) {
    const { id, targetKey, value, ...rest } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <Switch
            size={"lg"}
            checked={Boolean(value)}
            onCheckedChange={(e) => {
                setSettings(id, {
                    [targetKey]: e.checked,
                });
            }}
            {...rest}
        />
    );
});
