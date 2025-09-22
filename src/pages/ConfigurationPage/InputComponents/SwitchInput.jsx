import { useVariablesStore } from "@/store/variables-store";
import { Switch } from "@chakra-ui/react";
import { memo } from "react";

export const SwitchInput = memo(function SwitchInput(props) {
    const { id, targetKey, value, ...rest } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    return (
        <Switch.Root
            size={"lg"}
            checked={Boolean(value)}
            onCheckedChange={(e) => {
                setSettings(id, {
                    [targetKey]: e.checked,
                });
            }}
            {...rest}
        >
            <Switch.HiddenInput />
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
        </Switch.Root>
    );
});
