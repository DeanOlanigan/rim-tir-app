import { InputGroup, NumberInput } from "@chakra-ui/react";
import { useState } from "react";
import { LuHexagon } from "react-icons/lu";
import { patchNodeThrottled } from "./utils";

export const SidesBlock = ({ node }) => {
    const [value, setValue] = useState(node.sides());

    const handleChange = (value) => {
        const num = Number.isNaN(value) ? 3 : Math.max(3, Math.round(value));
        setValue(num);
        node.sides(num);
        patchNodeThrottled(node.id(), { sides: num });
    };

    return (
        <NumberInput.Root
            size={"xs"}
            min={3}
            max={12}
            step={1}
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
                        <LuHexagon />
                    </NumberInput.Scrubber>
                }
            >
                <NumberInput.Input />
            </InputGroup>
        </NumberInput.Root>
    );
};
