import { useState } from "react";
import { Flex, IconButton, parseColor } from "@chakra-ui/react";
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
import { testVariables, swatches, measurements } from "./graphSettingsConstants";

const getRandomColor = () => {
    return ("#" + (Math.random().toString(16) + "000000").slice(2, 8).toUpperCase());
};

function GraphVariable({ variable, index, updateVariable, removeVariable }) {
    console.log("Render GraphVariable");
    const [localState, setLocalState] = useState(variable);

    return (
        <Flex minH={"40px"} w={"100%"} background={"bg.muted"} rounded={"md"} align={"center"} px={"2"} gap={"2"}>
            <ColorPickerRoot size={"xs"}
                defaultValue={parseColor(variable.color)}
                onValueChange={(e) => {
                    setLocalState((prev) => ({ ...prev, color: e.value }));
                }}
            >
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
                collection={testVariables}
                size={"xs"}
                onValueChange={(e) => {
                    setLocalState((prev) => ({ ...prev, variable: e.value[0] }));
                }}
            >
                <SelectTrigger clearable>
                    <SelectValueText placeholder="Переменная" />
                </SelectTrigger>
                <SelectContent portalled={false}>
                    {testVariables.items.map((row) => (
                        <SelectItem item={row} key={row.value}>
                            {row.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>
            <SelectRoot
                collection={measurements}
                size={"xs"}
                onValueChange={(e) => {
                    setLocalState((prev) => ({ ...prev, measurement: e.value[0] }));
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
            <IconButton
                size={"xs"}
                variant={"ghost"}
                colorPalette={"red"}
                onClick={() => removeVariable(index)}
            >
                <LuTrash />
            </IconButton>
        </Flex>
    );
}

export default GraphVariable;
