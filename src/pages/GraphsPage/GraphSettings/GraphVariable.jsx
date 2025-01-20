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

function GraphVariable({ variable, index, updateVariable, removeVariable }) {
    const [localColor, setLocalColor] = useState(variable.color);

    return (
        <Flex minH={"40px"} w={"100%"} background={"bg.muted"} rounded={"md"} align={"center"} px={"2"} gap={"2"}>
            <ColorPickerRoot size={"xs"}
                defaultValue={parseColor(variable.color)}
                onValueChange={(e) => {
                    setLocalColor(e.value);
                }}
                onExitComplete={() => {
                    updateVariable(index, { 
                        ...variable, 
                        color: localColor.toString("hex")
                    });
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
                defaultValue={["test2"]}
                value={[variable.variableName]}
                onValueChange={(value) => {
                    updateVariable(index, {
                        ...variable, variableName: value.value[0]
                    });
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
                value={[variable.variableMeasurement]}
                defaultValue={["Вт"]}
                onValueChange={(value) => {
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
