import {
    Fieldset,
    Group,
    IconButton,
    InputGroup,
    NumberInput,
    Slider,
} from "@chakra-ui/react";
import { LuArrowRightLeft, LuEye, LuEyeClosed } from "react-icons/lu";
import { useNodesByIds } from "../utils";
import { patchStoreRaf } from "../../store/node-store";
import { LOCALE } from "../../constants";

export const OpacityBlock = ({ ids }) => {
    const op = useNodesByIds(ids, "opacity");
    const vis = useNodesByIds(ids, "visible");

    const opacity = op.every((n) => n === op[0]) ? op[0] * 100 : "";

    const show = vis.every((n) => n === vis[0]) ? vis[0] : true;

    const handleOpacity = (value) => {
        const val = Number.isNaN(value) ? 0 : Number((value / 100).toFixed(2));

        const patch = {};
        ids.forEach((id) => {
            patch[id] = { opacity: val };
        });
        patchStoreRaf(ids, patch);
    };

    const toggleOpacity = () => {
        const visible = !show;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { visible };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>{LOCALE.opacity}</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        max={100}
                        value={opacity}
                        disabled={!show}
                        onValueChange={(e) => handleOpacity(e.valueAsNumber)}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>
                                    <LuArrowRightLeft />
                                </NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <Slider.Root
                        size={"sm"}
                        w={"100%"}
                        value={[opacity]}
                        disabled={!show}
                        onValueChange={(e) => handleOpacity(e.value[0])}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>
                    <IconButton
                        size={"xs"}
                        variant={"outline"}
                        onClick={toggleOpacity}
                    >
                        {show ? <LuEye /> : <LuEyeClosed />}
                    </IconButton>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
