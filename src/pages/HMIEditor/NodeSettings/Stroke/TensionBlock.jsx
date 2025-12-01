import { Field, InputGroup, NumberInput } from "@chakra-ui/react";
import { useState } from "react";
import { LuSpline } from "react-icons/lu";
import { patchNodeThrottled } from "../utils";

export const TensionBlock = ({ node }) => {
    const [value, setValue] = useState(node.tension() || 0);

    const handleChange = (val) => {
        const num = Number.isNaN(val) ? 0 : val;
        setValue(num);
        node.tension(num);
        patchNodeThrottled(node.id(), { tension: num });
    };

    return (
        <Field.Root>
            <Field.Label>Tension</Field.Label>
            <NumberInput.Root
                size={"xs"}
                allowOverflow={false}
                min={0}
                max={2}
                step={0.1}
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
                            <LuSpline />
                        </NumberInput.Scrubber>
                    }
                >
                    <NumberInput.Input />
                </InputGroup>
            </NumberInput.Root>
        </Field.Root>
    );
};
