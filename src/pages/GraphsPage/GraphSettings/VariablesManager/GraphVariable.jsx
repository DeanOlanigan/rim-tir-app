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
import { useMemo } from "react";

export const GraphVariable = ({ id, data }) => {
    const { removeVariable } = useGraphStore.getState();
    const color = useColor(id);

    const collection = useMemo(() => {
        return createListCollection({
            items: data ?? [],
        });
    }, [data]);

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
            <VarColorPicker color={color} />
            <Select.Root
                collection={collection}
                size={"xs"}
                lazyMount
                unmountOnExit
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

const VarColorPicker = ({ color }) => {
    return (
        <ColorPicker.Root
            size={"xs"}
            defaultValue={parseColor(color)}
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
                        <ColorPicker.ChannelSlider channel={"hue"} />
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
