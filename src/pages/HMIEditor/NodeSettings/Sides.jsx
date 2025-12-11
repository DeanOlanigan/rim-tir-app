import { InputGroup, NumberInput } from "@chakra-ui/react";
import { LuHexagon } from "react-icons/lu";
import { sameCheck, useNodesByIds } from "./utils";
import { patchStoreRaf } from "../store/node-store";

export const SidesBlock = ({ ids }) => {
    const sides = useNodesByIds(ids, "sides");
    const side = sameCheck(sides);

    const handleChange = (value) => {
        const num = Number.isNaN(value) ? 3 : Math.max(3, Math.round(value));

        const patch = {};
        ids.forEach((id) => {
            patch[id] = { sides: num };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <NumberInput.Root
            size={"xs"}
            min={3}
            max={12}
            step={1}
            value={side}
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
