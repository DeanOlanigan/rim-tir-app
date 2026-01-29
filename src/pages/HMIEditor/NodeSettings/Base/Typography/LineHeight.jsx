import { Field, InputGroup, NumberInput } from "@chakra-ui/react";
import { TbLineHeight } from "react-icons/tb";
import { sameCheck, useNodesByIds } from "../../utils";
import { patchStoreRaf } from "@/pages/HMIEditor/store/node-store";

export const LineHeightBlock = ({ ids }) => {
    const lineHeights = useNodesByIds(ids, "lineHeight");
    const lineHeight = sameCheck(lineHeights);

    const handleChangeLineHeight = (value) => {
        const val = Number.isNaN(value) ? 0 : value;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { lineHeight: val };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Field.Root>
            <Field.Label>Line Height</Field.Label>
            <NumberInput.Root
                size={"xs"}
                min={0}
                step={0.1}
                value={lineHeight}
                onValueChange={(e) => handleChangeLineHeight(e.valueAsNumber)}
            >
                <NumberInput.Control />
                <InputGroup
                    startElementProps={{
                        pointerEvents: "auto",
                    }}
                    startElement={
                        <NumberInput.Scrubber>
                            <TbLineHeight />
                        </NumberInput.Scrubber>
                    }
                >
                    <NumberInput.Input />
                </InputGroup>
            </NumberInput.Root>
        </Field.Root>
    );
};
