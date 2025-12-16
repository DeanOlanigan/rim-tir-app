import { Field, SegmentGroup } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../utils";
import { patchStoreRaf } from "../../store/node-store";

export const TextWrapBlock = ({ ids }) => {
    const words = useNodesByIds(ids, "wrap");
    const word = sameCheck(words);

    const handleChange = (e) => {
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { wrap: e.value };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Field.Root>
            <Field.Label>Wrap</Field.Label>
            <SegmentGroup.Root
                size={"xs"}
                value={word}
                onValueChange={handleChange}
            >
                <SegmentGroup.Indicator bg={"colorPalette.solid"} />
                <SegmentGroup.Items items={["word", "char", "none"]} />
            </SegmentGroup.Root>
        </Field.Root>
    );
};
