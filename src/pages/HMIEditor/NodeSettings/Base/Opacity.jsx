import { Fieldset, Group, IconButton } from "@chakra-ui/react";
import { LuArrowRightLeft, LuEye, LuEyeClosed } from "react-icons/lu";
import { useNodesByIds } from "../utils";
import { useNodeStore } from "../../store/node-store";
import { LOCALE } from "../../constants";
import { PropertyInput } from "../PropertyInput";

export const OpacityBlock = ({ ids }) => {
    const vis = useNodesByIds(ids, "visible");

    const show = vis.every((n) => n === vis[0]) ? vis[0] : true;

    const toggleOpacity = () => {
        const visible = !show;
        const patch = {};
        for (const id of ids) patch[id] = { visible };
        useNodeStore.getState().updateNodes(patch);
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>{LOCALE.opacity}</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <PropertyInput
                        ids={ids}
                        property="opacity"
                        label={<LuArrowRightLeft />}
                        min={0}
                        max={100}
                        mapToStore={(v) => v / 100}
                        mapFromStore={(v) => v * 100}
                        disabled={!show}
                    />
                    <IconButton
                        size={"xs"}
                        variant={"outline"}
                        onClick={toggleOpacity}
                    >
                        {show ? <LuEye /> : <LuEyeClosed />}
                    </IconButton>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
