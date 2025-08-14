import { memo, useState } from "react";
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
} from "@/components/ui/color-picker";
import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "@/components/ui/select";
import { swatches, measurements } from "../graphSettingsConstants";
import { useVariablesOptions } from "@/hooks/useVariablesOptions";
import { useGraphStore } from "../../GraphStore";

function GraphVariable({
    variable,
    index /* updateVariable, removeVariable */,
}) {
    const variables = useVariablesOptions();
    const [color, setColor] = useState(parseColor(variable.color));

    const removeVariable = useGraphStore(state => state.removeVariableZus);
    const updateVariable = useGraphStore(state => state.updateVariableZus);

    console.log(`Render GraphVariable, index: ${index}`);
    return (
        <Flex
            minH={"40px"}
            w={"100%"}
            background={"bg.muted"}
            rounded={"md"}
            align={"center"}
            px={"2"}
            gap={"2"}
        >
            <ColorPickerRoot
                size={"xs"}
                defaultValue={parseColor(variable.color)}
                onValueChange={(e) => {
                    setColor(e.value);
                }}
                onExitComplete={() => {
                    updateVariable({
                        index,
                        updatedVariable: {
                            ...variable,
                            color: color.toString("hex"),
                        },
                    });
                }}
                onValueChangeEnd={(e) => {
                    updateVariable({
                        index,
                        updatedVariable: {
                            ...variable,
                            color: e.value.toString("hex"),
                        },
                    });
                }}
                closeOnSelect
            >
                <ColorPickerControl>
                    <ColorPickerTrigger border={"none"} />
                </ColorPickerControl>
                <ColorPickerContent>
                    <ColorPickerArea />
                    <ColorPickerSliders />
                    <ColorPickerSwatchGroup>
                        {swatches.map((swatch) => (
                            <ColorPickerSwatchTrigger
                                swatchSize={"4.5"}
                                key={swatch}
                                value={swatch}
                            />
                        ))}
                    </ColorPickerSwatchGroup>
                </ColorPickerContent>
            </ColorPickerRoot>
            <SelectRoot
                collection={variables}
                size={"xs"}
                value={[variable.variableName]}
                onValueChange={(e) => {
                    updateVariable({
                        index,
                        updatedVariable: {
                            ...variable,
                            variableName: e.value[0],
                        },
                    });
                }}
            >
                <SelectTrigger>
                    <SelectValueText placeholder="Переменная" />
                </SelectTrigger>
                <SelectContent portalled={false}>
                    {variables.items.map((row) => (
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
                onValueChange={(e) => {
                    updateVariable({
                        index,
                        updatedVariable: {
                            ...variable,
                            variableMeasurement: e.value[0],
                        },
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

export default memo(GraphVariable);
