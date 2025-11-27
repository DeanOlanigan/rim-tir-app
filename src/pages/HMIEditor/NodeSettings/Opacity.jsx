import {
    Fieldset,
    Group,
    IconButton,
    InputGroup,
    NumberInput,
    Slider,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowRightLeft, LuEye, LuEyeClosed } from "react-icons/lu";

export const OpacityBlock = ({ node }) => {
    const [value, setValue] = useState((node.opacity() * 100).toString());
    const [show, setShow] = useState(true);

    const handleOpacity = (value) => {
        const val = Number.isNaN(value) ? 0 : value;
        if (show) node.opacity(val / 100);
        setValue(String(val));
    };

    const toggleOpacity = () => {
        if (node.opacity() === 0) {
            node.opacity(value / 100);
            setShow(true);
        } else {
            node.opacity(0);
            setShow(false);
        }
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Opacity</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        max={100}
                        value={value}
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
                        value={[value]}
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
