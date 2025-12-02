import { Field, InputGroup, NumberInput } from "@chakra-ui/react";
import { TbLineHeight } from "react-icons/tb";
import { patchNodeThrottled } from "../utils";
import { useState } from "react";

export const PaddingBlock = ({ node }) => {
    const [value, setValue] = useState(node.padding() ?? 0);

    const handleChange = (value) => {
        const val = Number.isNaN(value) ? 0 : value;
        node.padding(val);
        setValue(val);
        patchNodeThrottled(node.id(), { padding: val });
    };

    return (
        <Field.Root>
            <Field.Label>Padding</Field.Label>
            <NumberInput.Root
                size={"xs"}
                min={0}
                value={value}
                onValueChange={(e) => handleChange(e.valueAsNumber)}
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
