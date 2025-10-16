import {
    ColorPicker,
    createListCollection,
    Flex,
    IconButton,
    parseColor,
    Portal,
    Select,
} from "@chakra-ui/react";
import { LuCheck, LuTrash } from "react-icons/lu";
import { swatches } from "../graphSettingsConstants";
import { useColor, useGraphStore } from "../../store/store";
import { useMemo, useState } from "react";

export const GraphVariable = ({ id, data }) => {
    const { removeVariable } = useGraphStore.getState();

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
            <VarColorPicker id={id} />
            <VarNameSelect id={id} data={data} />
            <IconButton
                size={"xs"}
                variant={"ghost"}
                colorPalette={"red"}
                onClick={() => removeVariable(id)}
            >
                <LuTrash />
            </IconButton>
        </Flex>
    );
};

const VarNameSelect = ({ id, data }) => {
    const collection = useMemo(() => {
        return createListCollection({
            items: data ?? [],
        });
    }, [data]);
    const varName = useGraphStore((state) => state.variables[id]?.name);
    const { setVariableName } = useGraphStore.getState();

    return (
        <Select.Root
            collection={collection}
            value={[varName]}
            size={"xs"}
            lazyMount
            unmountOnExit
            onValueChange={(e) => {
                setVariableName(id, e.value[0]);
            }}
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Переменная" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {collection.items.map((row) => (
                            <Select.Item item={row} key={row.value}>
                                {row.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

const VarColorPicker = ({ id }) => {
    const varColor = useColor(id);
    const [color, setColor] = useState(parseColor(varColor));
    const { setVariableColor } = useGraphStore.getState();

    return (
        <ColorPicker.Root
            size={"xs"}
            value={color}
            onValueChangeEnd={(e) =>
                setVariableColor(id, e.value.toString("hex"))
            }
            onValueChange={(e) => setColor(e.value)}
            onExitComplete={() => setVariableColor(id, color.toString("hex"))}
            closeOnSelect
            lazyMount
            unmountOnExit
        >
            <ColorPicker.HiddenInput />
            <ColorPicker.Control>
                <ColorPicker.Trigger border={"none"} />
            </ColorPicker.Control>
            <Portal>
                <ColorPicker.Positioner>
                    <ColorPicker.Content>
                        <ColorPicker.Area />
                        <ColorPicker.Sliders />
                        <ColorPicker.SwatchGroup>
                            {swatches.map((swatch) => (
                                <ColorPicker.SwatchTrigger
                                    key={swatch}
                                    value={swatch}
                                >
                                    <ColorPicker.Swatch value={swatch}>
                                        <ColorPicker.SwatchIndicator>
                                            <LuCheck />
                                        </ColorPicker.SwatchIndicator>
                                    </ColorPicker.Swatch>
                                </ColorPicker.SwatchTrigger>
                            ))}
                        </ColorPicker.SwatchGroup>
                    </ColorPicker.Content>
                </ColorPicker.Positioner>
            </Portal>
        </ColorPicker.Root>
    );
};
