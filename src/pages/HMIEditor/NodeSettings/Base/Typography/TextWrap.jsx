import { Field, SegmentGroup } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../../utils";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

export const TextWrapBlock = ({ ids }) => {
    const words = useNodesByIds(ids, "wrap");
    const word = sameCheck(words);

    const handleChange = (e) => {
        const patch = {};
        for (const id of ids) patch[id] = { wrap: e.value };
        useNodeStore.getState().updateNodes(patch);
    };

    return (
        <Field.Root>
            <Field.Label>{LOCALE.textWrap}</Field.Label>
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
