import { Field, InputGroup, NumberInput } from "@chakra-ui/react";
import { TbLineHeight } from "react-icons/tb";
import { sameCheck, useNodesByIds } from "../../utils";
import { patchStoreRaf } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

export const LetterSpacingBlock = ({ ids }) => {
    const letterSpacings = useNodesByIds(ids, "letterSpacing");
    const letterSpacing = sameCheck(letterSpacings);

    const handleChangeLetterSpacing = (value) => {
        const val = Number.isNaN(value) ? 0 : value;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { letterSpacing: val };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Field.Root>
            <Field.Label>{LOCALE.letterSpacing}</Field.Label>
            <NumberInput.Root
                size={"xs"}
                min={0}
                step={0.1}
                value={letterSpacing}
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
