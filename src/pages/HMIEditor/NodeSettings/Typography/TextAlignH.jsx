import { Field, SegmentGroup } from "@chakra-ui/react";
import { useState } from "react";
import {
    LuAlignCenter,
    LuAlignJustify,
    LuAlignLeft,
    LuAlignRight,
} from "react-icons/lu";
import { patchNodeThrottled } from "../utils";

export const TextAlignHBlock = ({ node }) => {
    const [value, setValue] = useState(node.align() ?? "left");

    const handleChange = (e) => {
        setValue(e.value);
        node.align(e.value);
        patchNodeThrottled(node.id(), { align: e.value });
    };

    return (
        <Field.Root>
            <Field.Label>Horizontal align</Field.Label>
            <SegmentGroup.Root
                size={"xs"}
                value={value}
                onValueChange={handleChange}
            >
                <SegmentGroup.Indicator bg={"colorPalette.solid"} />
                <SegmentGroup.Items
                    items={[
                        { value: "left", label: <LuAlignLeft size={16} /> },
                        { value: "center", label: <LuAlignCenter size={16} /> },
                        { value: "right", label: <LuAlignRight size={16} /> },
                        {
                            value: "justify",
                            label: <LuAlignJustify size={16} />,
                        },
                    ]}
                />
            </SegmentGroup.Root>
        </Field.Root>
    );
};
