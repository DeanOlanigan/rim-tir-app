import { Switch } from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "../utils";

export const EllipsisBlock = ({ node }) => {
    const [checked, setChecked] = useState(node.ellipsis());

    const onChange = (value) => {
        setChecked(value);
        node.ellipsis(value);
        patchNodeThrottled(node.id(), { ellipsis: value });
    };

    return (
        <Switch.Root
            size={"md"}
            checked={checked}
            onCheckedChange={(e) => onChange(e.checked)}
        >
            <Switch.HiddenInput />
            <Switch.Label>Ellipsis</Switch.Label>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
        </Switch.Root>
    );
};
