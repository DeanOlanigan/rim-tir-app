import { Field, InputGroup, NumberInput } from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "../utils";
//import { LuChevronDown } from "react-icons/lu";
import { RxFontSize } from "react-icons/rx";

//eslint-disable-next-line
//TODO подумать, что делать с селектом

/* const fontSizes = createListCollection({
    items: [
        { label: "10pt.", value: 10 },
        { label: "11pt.", value: 11 },
        { label: "12pt.", value: 12 },
        { label: "14pt.", value: 14 },
        { label: "15pt.", value: 15 },
        { label: "16pt.", value: 16 },
        { label: "20pt.", value: 20 },
        { label: "24pt.", value: 24 },
        { label: "32pt.", value: 32 },
        { label: "36pt.", value: 36 },
        { label: "40pt.", value: 40 },
        { label: "48pt.", value: 48 },
        { label: "64pt.", value: 64 },
        { label: "96pt.", value: 96 },
        { label: "128pt.", value: 128 },
    ],
}); */

export const FontSizeBlock = ({ node }) => {
    const [value, setValue] = useState([node.fontSize() ?? 12]);

    const handleChange = (value) => {
        setValue([value]);
        node.fontSize(value);
        patchNodeThrottled(node.id(), { fontSize: value });
    };

    return (
        <Field.Root>
            <Field.Label>Font Size</Field.Label>
            <NumberInput.Root
                size={"xs"}
                min={1}
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
                            <RxFontSize size={16} />
                        </NumberInput.Scrubber>
                    }
                >
                    <NumberInput.Input />
                </InputGroup>
            </NumberInput.Root>
            {/* <Select.Root
                size={"xs"}
                positioning={{ sameWidth: false }}
                collection={fontSizes}
                value={value}
                onValueChange={(e) => handleChange(e.value[0])}
                lazyMount
                unmountOnExit
            >
                <Select.HiddenSelect />
                <Select.Control>
                    <SelectTrigger />
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {fontSizes.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    {item.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root> */}
        </Field.Root>
    );
};

/* const SelectTrigger = () => {
    const select = useSelectContext();
    return (
        <IconButton
            size={"xs"}
            variant={"outline"}
            colorPalette={"gray"}
            borderLeftRadius={0}
            {...select.getTriggerProps()}
        >
            <LuChevronDown />
        </IconButton>
    );
}; */
