import { Switch } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../../utils";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

export const EllipsisBlock = ({ ids }) => {
    const ellipsises = useNodesByIds(ids, "ellipsis");
    const ellipsis = sameCheck(ellipsises);

    const onChange = (value) => {
        const patch = {};
        for (const id of ids) patch[id] = { ellipsis: value };
        useNodeStore.getState().updateNodes(patch);
    };

    return (
        <Switch.Root
            size={"md"}
            checked={ellipsis}
            onCheckedChange={(e) => onChange(e.checked)}
        >
            <Switch.HiddenInput />
            <Switch.Label>{LOCALE.ellipsis}</Switch.Label>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
        </Switch.Root>
    );
};
