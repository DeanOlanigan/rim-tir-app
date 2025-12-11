import { Field, InputGroup, NumberInput } from "@chakra-ui/react";
import { LuSpline } from "react-icons/lu";
import { sameCheck, useNodesByIds } from "../utils";
import { patchStoreRaf } from "../../store/node-store";

export const TensionBlock = ({ ids }) => {
    const tensions = useNodesByIds(ids, "tension");
    const tension = sameCheck(tensions);

    const handleChange = (val) => {
        const num = Number.isNaN(val) ? 0 : val;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { tension: num };
        });
        patchStoreRaf(ids, patch);
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
                value={tension}
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
