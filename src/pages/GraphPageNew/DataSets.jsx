import { RADII_MAIN } from "@/config/constants";
import {
    Badge,
    Box,
    Button,
    ColorPicker,
    createListCollection,
    Flex,
    Float,
    For,
    Heading,
    HStack,
    Icon,
    IconButton,
    parseColor,
    Portal,
    Select,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuPlus, LuTrash } from "react-icons/lu";

const DATASET_COUNT = 5;

export const DataSets = () => {
    return (
        <Flex
            px={6}
            py={4}
            bg={"bg.panel"}
            borderRadius={RADII_MAIN}
            shadow={"md"}
            w={"full"}
        >
            <VStack w={"full"} align={"start"} gap={2}>
                <HStack w={"full"} justify={"space-between"}>
                    <Heading>Датасеты</Heading>
                    <HStack>
                        <Badge size={"md"}>{DATASET_COUNT} / 5 создано</Badge>
                        <Button size={"xs"}>Применить к графику</Button>
                    </HStack>
                </HStack>
                <HStack w={"full"} justify={"start"} overflow={"auto"} py={2}>
                    <For each={Array.from({ length: DATASET_COUNT })}>
                        {(_, index) => (
                            <DataSetCard key={index} index={index} />
                        )}
                    </For>
                    <AddDataSet />
                </HStack>
            </VStack>
        </Flex>
    );
};

const DataSetCard = ({ index }) => {
    return (
        <VStack
            align={"start"}
            bg={"colorPalette.900/20"}
            border={"solid 1px"}
            shadow={"md"}
            borderColor={"colorPalette.600"}
            p={4}
            borderRadius={"lg"}
            position={"relative"}
            gap={2}
        >
            <Float offset={6}>
                <IconButton size={"xs"} variant={"subtle"} colorPalette={"red"}>
                    <LuTrash />
                </IconButton>
            </Float>
            <Text>Dataset {index + 1}</Text>
            <HStack>
                <VariableSelect />
                <VariableColor />
            </HStack>
        </VStack>
    );
};

const variables = createListCollection({
    items: [
        { label: "variable 1", value: "var_1" },
        { label: "variable 2", value: "var_2" },
        { label: "variable 3", value: "var_3" },
    ],
});

const VariableSelect = () => {
    return (
        <Select.Root
            collection={variables}
            defaultValue={[150]}
            width="180px"
            size="xs"
            lazyMount
            unmountOnExit
        >
            <Select.HiddenSelect />
            <Select.Label fontSize="xs" color="fg.muted">
                Переменная
            </Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Выберите переменную" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {variables.items.map((variable) => (
                            <Select.Item item={variable} key={variable.value}>
                                {variable.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

const VariableColor = () => {
    return (
        <ColorPicker.Root
            defaultValue={parseColor("#eb5e41")}
            size={"xs"}
            lazyMount
            unmountOnExit
        >
            <ColorPicker.HiddenInput />
            <ColorPicker.Label fontSize="xs" color="fg.muted">
                Цвет
            </ColorPicker.Label>
            <ColorPicker.Control>
                <ColorPicker.Trigger px="2">
                    <ColorPicker.ValueSwatch boxSize="4" />
                </ColorPicker.Trigger>
            </ColorPicker.Control>
            <Portal>
                <ColorPicker.Positioner>
                    <ColorPicker.Content>
                        <ColorPicker.Area />
                        <HStack>
                            <ColorPicker.EyeDropper
                                size="sm"
                                variant="outline"
                            />
                            <ColorPicker.Sliders />
                            <ColorPicker.ValueSwatch />
                        </HStack>
                    </ColorPicker.Content>
                </ColorPicker.Positioner>
            </Portal>
        </ColorPicker.Root>
    );
};

const AddDataSet = () => {
    return (
        <VStack
            as={"button"}
            focusVisibleRing="outside"
            border={"dashed 1px"}
            shadow={"md"}
            borderColor={{ base: "border", _hover: "colorPalette.border" }}
            bg={{ base: "bg.panel", _hover: "colorPalette.900/20" }}
            cursor={"pointer"}
            p={5}
            borderRadius={"lg"}
            position={"relative"}
            maxH={"128px"}
            minW={"256px"}
            gap={2}
        >
            <Box bg={"bg.muted"} borderRadius={"full"} p={3}>
                <Icon as={LuPlus} size={"2xl"} />
            </Box>
            <Text>Добавить датасет</Text>
        </VStack>
    );
};
