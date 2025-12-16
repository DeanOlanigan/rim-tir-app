import { Field, InputGroup, NumberInput } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../utils";
import { RxFontSize } from "react-icons/rx";
import { patchStoreRaf } from "../../store/node-store";

export const FontSizeBlock = ({ ids }) => {
    const fontSizes = useNodesByIds(ids, "fontSize");
    const fontSize = sameCheck(fontSizes);

    const handleChange = (value) => {
        const val = Number.isNaN(value) ? 0 : value;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { fontSize: val };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Field.Root>
            <Field.Label>Font Size</Field.Label>
            <NumberInput.Root
                size={"xs"}
                min={1}
                value={fontSize}
                onValueChange={(e) => handleChange(e.valueAsNumber)}
            >
                <NumberInput.Control />
                <InputGroup
                    startElementProps={{
                        pointerEvents: "auto",
                    }}
                    startElement={
                        <NumberInput.Scrubber>
                            <RxFontSize size={16} />
                        </NumberInput.Scrubber>
                    }
                >
                    <NumberInput.Input />
                </InputGroup>
            </NumberInput.Root>
        </Field.Root>
    );
};
