import { Field, SegmentGroup } from "@chakra-ui/react";
import { TbJoinBevel, TbJoinRound, TbJoinStraight } from "react-icons/tb";
import { sameCheck, useNodesByIds } from "../../utils";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

export const LineJoinBlock = ({ ids }) => {
    const lineJoins = useNodesByIds(ids, "lineJoin");
    const lineJoin = sameCheck(lineJoins);

    const handleChange = (e) => {
        const patch = {};
        for (const id of ids) patch[id] = { lineJoin: e.value };
        useNodeStore.getState().updateNodes(patch);
    };

    return (
        <Field.Root>
            <Field.Label>{LOCALE.lineJoin}</Field.Label>
            <SegmentGroup.Root
                size={"xs"}
                value={lineJoin}
                onValueChange={handleChange}
            >
                <SegmentGroup.Indicator bg={"colorPalette.solid"} />
                <SegmentGroup.Items
                    items={[
                        { value: "miter", label: <TbJoinStraight size={16} /> },
                        { value: "round", label: <TbJoinRound size={16} /> },
                        { value: "bevel", label: <TbJoinBevel size={16} /> },
                    ]}
                />
            </SegmentGroup.Root>
        </Field.Root>
    );
};
