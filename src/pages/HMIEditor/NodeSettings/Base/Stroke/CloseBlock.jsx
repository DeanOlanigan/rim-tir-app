import { Switch } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../../utils";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

export const CloseBlock = ({ ids }) => {
    const allClosed = useNodesByIds(ids, "closed");
    const closed = sameCheck(allClosed) || allClosed[0];

    const onChange = (value) => {
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { closed: value };
        });
        useNodeStore.getState().updateNodes(ids, patch);
    };

    return (
        <Switch.Root
            size={"md"}
            checked={closed}
            onCheckedChange={(e) => onChange(e.checked)}
        >
            <Switch.HiddenInput />
            <Switch.Label>{LOCALE.closePoly}</Switch.Label>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
        </Switch.Root>
    );
};
