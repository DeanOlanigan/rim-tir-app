import { Switch } from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "../utils";

export const BezierBlock = ({ node }) => {
    const [checked, setChecked] = useState(node.bezier());

    const onChange = (value) => {
        setChecked(value);
        node.bezier(value);
        patchNodeThrottled(node.id(), { bezier: value });
    };

    return (
        <Switch.Root
            size={"md"}
            checked={checked}
            onCheckedChange={(e) => onChange(e.checked)}
        >
            <Switch.HiddenInput />
            <Switch.Label>Bezier</Switch.Label>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
        </Switch.Root>
    );
};
