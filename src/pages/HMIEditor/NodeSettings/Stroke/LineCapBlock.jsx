import { Field, SegmentGroup } from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "../utils";
import { TbCapProjecting, TbCapRounded, TbCapStraight } from "react-icons/tb";

export const LineCapBlock = ({ node }) => {
    const [value, setValue] = useState(node.lineCap() ?? "butt");

    const handleChange = (e) => {
        setValue(e.value);
        node.lineCap(e.value);
        patchNodeThrottled(node.id(), { lineCap: e.value });
    };

    return (
        <Field.Root>
            <Field.Label>Line Cap</Field.Label>
            <SegmentGroup.Root
                size={"xs"}
                value={value}
                onValueChange={handleChange}
            >
                <SegmentGroup.Indicator bg={"colorPalette.solid"} />
                <SegmentGroup.Items
                    items={[
                        { value: "butt", label: <TbCapStraight size={16} /> },
                        { value: "round", label: <TbCapRounded size={16} /> },
                        {
                            value: "square",
                            label: <TbCapProjecting size={16} />,
                        },
                    ]}
                />
            </SegmentGroup.Root>
        </Field.Root>
    );
};
