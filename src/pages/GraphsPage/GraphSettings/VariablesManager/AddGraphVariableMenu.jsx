import { Button, Text, HStack } from "@chakra-ui/react";
import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTitle,
    PopoverTrigger,
    PopoverHeader,
    PopoverFooter,
    PopoverCloseTrigger
} from "../../../../components/ui/popover";
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
} from "../../../../components/ui/color-picker";
import { 
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../../../components/ui/select";
import { swatches, points } from "../graphSettingsConstants";

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
