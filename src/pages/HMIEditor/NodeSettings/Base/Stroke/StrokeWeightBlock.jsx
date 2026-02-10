import {
    Fieldset,
    Group,
    InputGroup,
    NumberInput,
    Slider,
} from "@chakra-ui/react";
import { MdLineWeight } from "react-icons/md";
import { sameCheck, useNodesByIds } from "../../utils";
import { patchStoreRaf } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

export const StrokeWeightBlock = ({ ids }) => {
    const strokeWidths = useNodesByIds(ids, "strokeWidth");
    const strokeWidth = sameCheck(strokeWidths);

    const handleWeight = (value) => {
        let val = value;
        if (Number.isNaN(value)) val = 0;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { strokeWidth: val };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>{LOCALE.strokeWidth}</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        max={100}
                        value={strokeWidth}
                        onValueChange={(e) => handleWeight(e.valueAsNumber)}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>
                                    <MdLineWeight />
                                </NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <Slider.Root
                        size={"sm"}
                        w={"100%"}
                        value={[strokeWidth]}
                        onValueChange={(e) => handleWeight(e.value[0])}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
