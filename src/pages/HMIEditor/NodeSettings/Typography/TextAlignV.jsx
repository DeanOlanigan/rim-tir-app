import { Field, SegmentGroup } from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "../utils";
import { LuArrowDownToLine, LuArrowUpToLine } from "react-icons/lu";
import { BsArrowsCollapse } from "react-icons/bs";

export const TextAlignVBlock = ({ node }) => {
    const [value, setValue] = useState(node.verticalAlign() ?? "top");

    const handleChange = (e) => {
        setValue(e.value);
        node.verticalAlign(e.value);
        patchNodeThrottled(node.id(), { verticalAlign: e.value });
    };

    return (
        <Field.Root>
            <Field.Label>Vertical align</Field.Label>
            <SegmentGroup.Root
                size={"xs"}
                value={value}
                onValueChange={handleChange}
            >
                <SegmentGroup.Indicator bg={"colorPalette.solid"} />
                <SegmentGroup.Items
                    items={[
                        { value: "top", label: <LuArrowUpToLine size={16} /> },
                        {
                            value: "middle",
                            label: <BsArrowsCollapse size={16} />,
                        },
                        {
                            value: "bottom",
                            label: <LuArrowDownToLine size={16} />,
                        },
                    ]}
                />
            </SegmentGroup.Root>
        </Field.Root>
    );
};
