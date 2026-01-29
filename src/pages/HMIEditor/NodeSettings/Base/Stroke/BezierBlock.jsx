import { Switch } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../../utils";
import { patchStoreRaf } from "@/pages/HMIEditor/store/node-store";

export const BezierBlock = ({ ids }) => {
    const allBezier = useNodesByIds(ids, "bezier");
    const bezier = sameCheck(allBezier) || allBezier[0];

    const onChange = (value) => {
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { bezier: value };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Switch.Root
            size={"md"}
            checked={bezier}
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
