import { Flex, IconButton, createListCollection, parseColor } from "@chakra-ui/react";
import { LuTrash } from "react-icons/lu";
import {
    ColorPickerArea,
    ColorPickerContent,
    ColorPickerControl,
    ColorPickerRoot,
    ColorPickerSliders,
    ColorPickerSwatchGroup,
    ColorPickerSwatchTrigger,
    ColorPickerTrigger,
} from "../../../components/ui/color-picker";
import { 
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../../components/ui/select";

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

const swatches = ["#000000", "#4A5568", "#F56565", "#ED64A6", "#9F7AEA", "#6B46C1", "#4299E1", "#0BC5EA", "#00B5D8", "#38B2AC", "#48BB78", "#68D391", "#ECC94B", "#DD6B20"];

const measurements = createListCollection({
    items: [
        { label: "°С", value: "°С" },
        { label: "Па", value: "Па" },
        { label: "кПа", value: "кПа" },
        { label: "Вт", value: "Вт" },
        { label: "кВт", value: "кВт" },
        { label: "мВт", value: "мВт" },
        { label: "В", value: "В" },
        { label: "кВ", value: "кВ" },
        { label: "А", value: "А" },
        { label: "кА", value: "кА" },
    ]
});

function GraphVariable({ variable, index, updateVariable, removeVariable }) {
    return (
        <Flex minH={"40px"} w={"100%"} background={"bg.muted"} rounded={"md"} align={"center"} px={"2"} gap={"2"}>
            <ColorPickerRoot size={"xs"} defaultValue={parseColor(variable.color)}>
                <ColorPickerControl>
                    <ColorPickerTrigger border={"none"} />
                </ColorPickerControl>
                <ColorPickerContent>
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
                value={[variable.variableName]}
                onValueChange={(value) => {
                    console.log(value.value[0]);
                    updateVariable(index, {
                        ...variable, variableName: value.value[0]
                    });
                }}
            >
                <SelectTrigger clearable>
                    <SelectValueText placeholder="Переменная" />
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
                collection={measurements}
                size={"xs"}
                value={[variable.variableMeasurement]}
                defaultValue={["Вт"]}
                onValueChange={(value) => {
                    console.log(value.value[0]);
                    updateVariable(index, {
                        ...variable, variableMeasurement: value.value[0]
                    });
                }}
            >
                <SelectTrigger>
                    <SelectValueText placeholder="Ед. измерения" />
                </SelectTrigger>
                <SelectContent>
                    {measurements.items.map((row) => (
                        <SelectItem item={row} key={row.value}>
                            {row.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>
            <IconButton size={"xs"} variant={"ghost"} colorPalette={"red"} onClick={() => removeVariable(index)}>
                <LuTrash />
            </IconButton>
        </Flex>
    );
}

export default GraphVariable;
