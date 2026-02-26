import { Switch } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../../utils";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

export const CloseBlock = ({ ids }) => {
    const allClosed = useNodesByIds(ids, "closed");
    const closed = sameCheck(allClosed) || allClosed[0];

    const onChange = (value) => {
        const patch = {};
        for (const id of ids) patch[id] = { closed: value };
        useNodeStore.getState().updateNodes(patch);
    };

    return (
        <Switch.Root
            size={"md"}
            checked={closed}
            onCheckedChange={(e) => onChange(e.checked)}
        >
            <Switch.HiddenInput />
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>{LOCALE.closePoly}</Switch.Label>
        </Switch.Root>
    );
};
