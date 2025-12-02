import { Field, InputGroup, NumberInput } from "@chakra-ui/react";
import { TbLineHeight } from "react-icons/tb";
import { patchNodeThrottled } from "../utils";
import { useState } from "react";

export const LineHeightBlock = ({ node }) => {
    const [value, setValue] = useState(node.lineHeight() ?? 1);

    const handleChangeLineHeight = (value) => {
        const val = Number.isNaN(value) ? 0 : value;
        node.lineHeight(val);
        setValue(val);
        patchNodeThrottled(node.id(), { lineHeight: val });
    };

    return (
        <Field.Root>
            <Field.Label>Line Height</Field.Label>
            <NumberInput.Root
                size={"xs"}
                min={0}
                step={0.1}
                value={value}
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
