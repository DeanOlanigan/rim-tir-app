import { Switch } from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "../utils";

export const CloseBlock = ({ node }) => {
    const [checked, setChecked] = useState(node.closed());

    const onChange = (value) => {
        setChecked(value);
        node.closed(value);
        patchNodeThrottled(node.id(), { closed: value });
    };

    return (
        <Switch.Root
            size={"md"}
            checked={checked}
            onCheckedChange={(e) => onChange(e.checked)}
        >
            <Switch.HiddenInput />
            <Switch.Label>Closed</Switch.Label>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
        </Switch.Root>
    );
};
