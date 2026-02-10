import { Field, InputGroup, NumberInput } from "@chakra-ui/react";
import { TbLineHeight } from "react-icons/tb";
import { sameCheck, useNodesByIds } from "../../utils";
import { patchStoreRaf } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

export const PaddingBlock = ({ ids }) => {
    const paddings = useNodesByIds(ids, "padding");
    const padding = sameCheck(paddings);

    const handleChange = (value) => {
        const val = Number.isNaN(value) ? 0 : value;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { padding: val };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Field.Root>
            <Field.Label>{LOCALE.padding}</Field.Label>
            <NumberInput.Root
                size={"xs"}
                min={0}
                value={padding}
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
