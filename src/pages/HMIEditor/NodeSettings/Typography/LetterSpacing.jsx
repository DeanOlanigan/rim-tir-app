import { Field, InputGroup, NumberInput } from "@chakra-ui/react";
import { TbLineHeight } from "react-icons/tb";
import { patchNodeThrottled } from "../utils";
import { useState } from "react";

export const LetterSpacingBlock = ({ node }) => {
    const [value, setValue] = useState(node.letterSpacing() ?? 0);

    const handleChangeLetterSpacing = (value) => {
        const val = Number.isNaN(value) ? 0 : value;
        node.letterSpacing(val);
        setValue(val);
        patchNodeThrottled(node.id(), { letterSpacing: val });
    };

    return (
        <Field.Root>
            <Field.Label>Letter Spacing</Field.Label>
            <NumberInput.Root
                size={"xs"}
                min={0}
                step={0.1}
                value={value}
                onValueChange={(e) =>
                    handleChangeLetterSpacing(e.valueAsNumber)
                }
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
