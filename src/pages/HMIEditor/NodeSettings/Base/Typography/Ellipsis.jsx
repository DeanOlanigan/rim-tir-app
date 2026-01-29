import { Switch } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../../utils";
import { patchStoreRaf } from "@/pages/HMIEditor/store/node-store";

export const EllipsisBlock = ({ ids }) => {
    const ellipsises = useNodesByIds(ids, "ellipsis");
    const ellipsis = sameCheck(ellipsises);

    const onChange = (value) => {
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { ellipsis: value };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Switch.Root
            size={"md"}
            checked={ellipsis}
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
