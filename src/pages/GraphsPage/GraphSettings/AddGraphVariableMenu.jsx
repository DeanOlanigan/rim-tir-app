import { Button, Text, HStack, createListCollection } from "@chakra-ui/react";
import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTitle,
    PopoverTrigger,
    PopoverHeader,
    PopoverFooter,
    PopoverCloseTrigger
} from "../../../components/ui/popover";
import {
    ColorPickerArea,
    ColorPickerContent,
    ColorPickerControl,
    ColorPickerRoot,
    ColorPickerLabel,
    ColorPickerSliders,
    ColorPickerSwatchGroup,
    ColorPickerSwatchTrigger,
    ColorPickerTrigger,
} from "../../../components/ui/color-picker";
import { 
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../../components/ui/select";

const swatches = ["#000000", "#4A5568", "#F56565", "#ED64A6", "#9F7AEA", "#6B46C1", "#4299E1", "#0BC5EA", "#00B5D8", "#38B2AC", "#48BB78", "#68D391", "#ECC94B", "#DD6B20"];
const points = createListCollection({
    items: [
        { label: "10", value: "10" },
        { label: "20", value: "20" },
        { label: "50", value: "50" },
        { label: "100", value: "100" },
        { label: "200", value: "200" },
        { label: "500", value: "500" },
        { label: "1000", value: "1000" },
    ],
});

function AddGraphVariableMenu() {
    return (
        <PopoverRoot positioning={{ sameWidth: true, placement: "top" }}>
            <PopoverTrigger asChild>
                <Button size={"xs"} variant={"subtle"}>
                    Добавить переменную
                </Button>
            </PopoverTrigger>
            <PopoverContent width="full" height="214px">
                <PopoverHeader>
                    <PopoverTitle>
                        <Text>Добавить переменную</Text>        
                        <PopoverCloseTrigger />
                    </PopoverTitle>
                </PopoverHeader>
                <PopoverBody>
                    <HStack>
                        <ColorPickerRoot size={"xs"}>
                            <ColorPickerLabel>Цвет:</ColorPickerLabel>
                            <ColorPickerControl>
                                <ColorPickerTrigger roundedRight={"none"} />
                            </ColorPickerControl>
                            <ColorPickerContent portalled={false}>
                                <ColorPickerArea />
                                <ColorPickerSliders />
                                <ColorPickerSwatchGroup>
                                    {
                                        swatches.map((swatch) => (
                                            <ColorPickerSwatchTrigger
                                                swatchSize={"4.5"}
                                                key={swatch}
                                                value={swatch}
                                            />
                                        ))
                                    }
                                </ColorPickerSwatchGroup>
                            </ColorPickerContent>
                        </ColorPickerRoot>
                        <SelectRoot
                            collection={points}
                            size={"xs"}
                            defaultValue={["100"]}
                        >
                            <SelectLabel>Количество точек:</SelectLabel>
                            <SelectTrigger clearable>
                                <SelectValueText placeholder="Выберите количество точек" />
                            </SelectTrigger>
                            <SelectContent portalled={false}>
                                {points.items.map((row) => (
                                    <SelectItem item={row} key={row.value}>
                                        {row.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot>
                        <SelectRoot
                            collection={points}
                            size={"xs"}
                            defaultValue={["100"]}
                        >
                            <SelectLabel>Количество точек:</SelectLabel>
                            <SelectTrigger clearable>
                                <SelectValueText placeholder="Выберите количество точек" />
                            </SelectTrigger>
                            <SelectContent portalled={false}>
                                {points.items.map((row) => (
                                    <SelectItem item={row} key={row.value}>
                                        {row.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot>
                    </HStack>
                </PopoverBody>
                <PopoverFooter justifyContent={"end"}>
                    <Button size={"xs"}>Добавить</Button>
                </PopoverFooter>
            </PopoverContent>
        </PopoverRoot>
    );
}

export default AddGraphVariableMenu;
