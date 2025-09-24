import { useVariablesStore } from "@/store/variables-store";
import { InputGroup, Switch } from "@chakra-ui/react";
import { memo } from "react";
import { ErrorSign } from "./ErrorSign";

export const SwitchInput = memo(function SwitchInput(props) {
    const { id, targetkey, value, errors, ...rest } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    return (
        <InputGroup
            endElement={
                errors && errors.size !== 0 && <ErrorSign errors={errors} />
            }
        >
            <Switch.Root
                size={"lg"}
                checked={Boolean(value)}
                onCheckedChange={(e) => {
                    setSettings(id, {
                        [targetkey]: e.checked,
                    });
                }}
                {...rest}
            >
                <Switch.HiddenInput />
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
            </Switch.Root>
        </InputGroup>
    );
});
