import { Field, SegmentGroup } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../utils";
import { TbJoinBevel, TbJoinRound, TbJoinStraight } from "react-icons/tb";
import { patchStoreRaf } from "../../store/node-store";

export const LineJoinBlock = ({ ids }) => {
    const lineJoins = useNodesByIds(ids, "lineJoin");
    const lineJoin = sameCheck(lineJoins);

    const handleChange = (e) => {
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { lineJoin: e.value };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Field.Root>
            <Field.Label>Line Join</Field.Label>
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
