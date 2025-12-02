import { Field, SegmentGroup } from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "../utils";

export const TextWrapBlock = ({ node }) => {
    const [value, setValue] = useState(node.wrap() ?? "word");

    const handleChange = (e) => {
        setValue(e.value);
        node.wrap(e.value);
        patchNodeThrottled(node.id(), { wrap: e.value });
    };

    return (
        <Field.Root>
            <Field.Label>Wrap</Field.Label>
            <SegmentGroup.Root
                size={"xs"}
                value={value}
                onValueChange={handleChange}
            >
                <SegmentGroup.Indicator bg={"colorPalette.solid"} />
                <SegmentGroup.Items items={["word", "char", "none"]} />
            </SegmentGroup.Root>
        </Field.Root>
    );
};
