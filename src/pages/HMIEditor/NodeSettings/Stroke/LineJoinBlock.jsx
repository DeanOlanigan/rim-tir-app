import { Field, SegmentGroup } from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "../utils";
import { TbJoinBevel, TbJoinRound, TbJoinStraight } from "react-icons/tb";

export const LineJoinBlock = ({ node }) => {
    const [value, setValue] = useState(node.lineJoin() ?? "miter");

    const handleChange = (e) => {
        setValue(e.value);
        node.lineJoin(e.value);
        patchNodeThrottled(node.id(), { lineJoin: e.value });
    };

    return (
        <Field.Root>
            <Field.Label>Line Join</Field.Label>
            <SegmentGroup.Root
                size={"sm"}
                value={value}
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
