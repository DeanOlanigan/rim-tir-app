import { RADII_MAIN } from "@/config/constants";
import {
    Badge,
    Box,
    Button,
    ColorPicker,
    createListCollection,
    Field,
    Flex,
    Float,
    Heading,
    HStack,
    Icon,
    IconButton,
    Input,
    parseColor,
    Portal,
    Select,
    Text,
    VStack,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import {
    useController,
    useFieldArray,
    useFormContext,
    useWatch,
} from "react-hook-form";
import { LuCheck, LuPlus, LuTrash } from "react-icons/lu";

const MAX_DATASET_COUNT = 5;

const defaultColors = ["#eb5e41", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

function createDefaultDataset(index = 0) {
    return {
        id: nanoid(8),
        variable: "",
        alias: "",
        color: defaultColors[index % defaultColors.length],
    };
}

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
                        <DataSetBadge />
                        <ApplyButton />
                    </HStack>
                </HStack>
                <FieldArrayError />
                <DataSetList />
            </VStack>
        </Flex>
    );
};

const DataSetBadge = () => {
    const { control } = useFormContext();
    const datasets = useWatch({ control, name: "datasets" });

    return (
        <Badge size={"md"}>
            {datasets.length} / {MAX_DATASET_COUNT} создано
        </Badge>
    );
};

const DataSetList = () => {
    const { control, trigger } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "datasets",
        keyName: "fieldKey",
    });

    useEffect(() => {
        trigger("datasets");
    }, [fields.length, trigger]);

    const canAdd = fields.length < MAX_DATASET_COUNT;
    return (
        <HStack w={"full"} justify={"start"} overflow={"auto"} py={2}>
            {fields.map((field, index) => (
                <DataSetCard
                    key={field.fieldKey ?? field.id}
                    index={index}
                    onRemove={() => remove(index)}
                />
            ))}
            {canAdd && (
                <AddDataSet
                    onAdd={() => append(createDefaultDataset(fields.length))}
                />
            )}
        </HStack>
    );
};

const FieldArrayError = () => {
    const {
        formState: { errors },
    } = useFormContext();

    const message = errors.datasets?.message;

    if (!message) return null;

    return (
        <Text fontSize="sm" color="fg.error">
            {message}
        </Text>
    );
};

const DataSetCard = ({ index, onRemove }) => {
    return (
        <VStack
            align={"start"}
            bg={"colorPalette.500/20"}
            border={"solid 1px"}
            shadow={"md"}
            borderColor={"colorPalette.600"}
            p={4}
            borderRadius={"lg"}
            position={"relative"}
            gap={2}
            minH={"146px"}
        >
            <Float offset={6} zIndex={"sticky"}>
                <IconButton
                    size={"xs"}
                    variant={"subtle"}
                    colorPalette={"red"}
                    onClick={onRemove}
                    aria-label={`Удалить датасет ${index + 1}`}
                >
                    <LuTrash />
                </IconButton>
            </Float>
            <AliasField index={index} />
            <HStack align={"start"}>
                <VariableSelect index={index} />
                <VariableColor index={index} />
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

const VariableSelect = ({ index }) => {
    const { control } = useFormContext();

    const {
        field,
        fieldState: { error },
    } = useController({
        name: `datasets.${index}.variable`,
        control,
    });

    return (
        <Field.Root invalid={!!error}>
            <Field.Label fontSize="xs" color="fg.muted">
                Переменная
            </Field.Label>
            <Select.Root
                name={field.name}
                collection={variables}
                value={field.value ? [field.value] : []}
                onValueChange={({ value }) => field.onChange(value?.[0] ?? "")}
                onInteractOutside={() => field.onBlur()}
                size="xs"
                variant={"subtle"}
                width="180px"
                lazyMount
                unmountOnExit
            >
                <Select.HiddenSelect />
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
                                <Select.Item
                                    item={variable}
                                    key={variable.value}
                                >
                                    {variable.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
            <Field.ErrorText>{error?.message}</Field.ErrorText>
        </Field.Root>
    );
};

const VariableColor = ({ index }) => {
    const { control } = useFormContext();

    const { field } = useController({
        name: `datasets.${index}.color`,
        control,
    });

    return (
        <ColorPicker.Root
            variant={"subtle"}
            value={field.value ? parseColor(field.value) : undefined}
            onValueChange={({ valueAsString }) => field.onChange(valueAsString)}
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
                        <ColorPicker.Sliders />
                        <ColorPicker.ValueSwatch />
                        <ColorPicker.SwatchGroup>
                            {defaultColors.map((swatch) => (
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

const AddDataSet = ({ onAdd }) => {
    return (
        <VStack
            as={"button"}
            type="button"
            onClick={onAdd}
            focusVisibleRing="outside"
            border={"dashed 1px"}
            shadow={"md"}
            borderColor={{ base: "border", _hover: "colorPalette.border" }}
            bg={{ base: "bg.panel", _hover: "colorPalette.500/20" }}
            cursor={"pointer"}
            p={4}
            borderRadius={"lg"}
            position={"relative"}
            minH={"146px"}
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

const ApplyButton = () => {
    const {
        formState: { isDirty, isValid, isSubmitting },
    } = useFormContext();

    return (
        <Button
            type="submit"
            size={"xs"}
            disabled={!isDirty || !isValid || isSubmitting}
            loading={isSubmitting}
        >
            Применить к графику
        </Button>
    );
};

const AliasField = ({ index }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const error = errors?.datasets?.[index]?.alias?.message;

    return (
        <Field.Root invalid={!!error} w="full">
            <Field.Label fontSize="xs" color="fg.muted">
                Псевдоним
            </Field.Label>
            <Input
                variant={"flushed"}
                size="2xs"
                placeholder="Введите псевдоним"
                {...register(`datasets.${index}.alias`)}
            />
            <Field.ErrorText>{error}</Field.ErrorText>
        </Field.Root>
    );
};
