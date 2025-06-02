import { useVariablesStore } from "@/store/variables-store";
import { Switch } from "@chakra-ui/react";
import { memo /* useState */ } from "react";

export const SwitchInput = memo(function SwitchInput(props) {
    const { id, targetKey, value, ...rest } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    //const [checked, setChecked] = useState(value);
    return (
        <Switch.Root
            size={"lg"}
            checked={Boolean(value)}
            onCheckedChange={(e) => {
                setSettings(id, {
                    [targetKey]: e.checked,
                });
                /* setChecked(e.checked);
                setTimeout(() => {
                }, 150); */
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
