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
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { useEffect, useMemo } from "react";
import {
    useController,
    useFieldArray,
    useFormContext,
    useWatch,
} from "react-hook-form";
import { LuCheck, LuPlus, LuTrash } from "react-icons/lu";
import { useVariables } from "./useVariables";

const MAX_DATASET_COUNT = 5;

const defaultColors = [
    "#eb5e41",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#000000", // Black
    "#33FF57", // Green
    "#3357FF", // Blue
    "#FF33A6", // Pink
    "#FFD700", // Gold
    "#00FFFF", // Aqua
    "#8A2BE2", // Blue Violet
    "#DC143C",
];

function createDefaultDataset(index = 0) {
    return {
        id: nanoid(8),
        variable: "",
        variableId: "",
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

    const { data, isLoading, isError, error } = useVariables();

    const variableCollection = useMemo(() => {
        return createListCollection({
            items: data ?? [],
            itemToString: (variable) => variable.name,
            itemToValue: (variable) => variable.id,
        });
    }, [data]);

    const canAdd = fields.length < MAX_DATASET_COUNT;
    return (
        <VStack w={"full"} align={"stretch"}>
            {isError && (
                <Text color="fg.error" fontWeight={"medium"} textStyle={"sm"}>
                    {error.message}
                </Text>
            )}

            {!isError &&
                !isLoading &&
                variableCollection.items.length === 0 && (
                    <Text
                        color="fg.muted"
                        fontWeight={"medium"}
                        textStyle={"sm"}
                    >
                        Нет доступных переменных для выбора
                    </Text>
                )}
            <HStack
                w={"full"}
                align={"start"}
                justify={"start"}
                overflow={"auto"}
                py={2}
            >
                {fields.map((field, index) => (
                    <DataSetCard
                        key={field.fieldKey ?? field.id}
                        index={index}
                        variableCollection={variableCollection}
                        variablesLoading={isLoading}
                        variablesError={isError ? error : null}
                        onRemove={() => remove(index)}
                    />
                ))}
                {canAdd && (
                    <AddDataSet
                        onAdd={() =>
                            append(createDefaultDataset(fields.length))
                        }
                    />
                )}
            </HStack>
        </VStack>
    );
};

const FieldArrayError = () => {
    const {
        formState: { errors },
    } = useFormContext();

    const message = errors.datasets?.message;

    if (!message) return null;

    return (
        <Text color="fg.error" fontWeight={"medium"} textStyle={"sm"}>
            {message}
        </Text>
    );
};

const DataSetCard = ({
    index,
    onRemove,
    variableCollection,
    variablesLoading,
    variablesError,
}) => {
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
                <VariableSelect
                    index={index}
                    collection={variableCollection}
                    isLoading={variablesLoading}
                    requestError={variablesError}
                />
                <VariableColor index={index} />
            </HStack>
        </VStack>
    );
};

const VariableSelect = ({ index, collection, isLoading, requestError }) => {
    const { control, setValue } = useFormContext();

    const {
        field,
        fieldState: { error },
    } = useController({
        name: `datasets.${index}.variableId`,
        control,
    });

    const isDisabled =
        isLoading || !!requestError || collection.items.length === 0;

    let placeholder = "Выберите переменную";

    if (isLoading) {
        if (collection.items.length === 0)
            placeholder = "Нет доступных переменных";
        else placeholder = "Загрузка переменных";
    } else if (requestError) placeholder = "Ошибка загрузки переменных";

    return (
        <Field.Root invalid={!!error}>
            <Field.Label fontSize="xs" color="fg.muted">
                Переменная
            </Field.Label>
            <Select.Root
                name={field.name}
                collection={collection}
                value={field.value ? [field.value] : []}
                onValueChange={({ value }) => {
                    const nextId = value?.[0] ?? "";
                    const selected = collection.items.find(
                        (item) => String(item.id) === String(nextId),
                    );
                    field.onChange(nextId);

                    setValue(
                        `datasets.${index}.variable`,
                        selected?.name ?? "",
                        {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                        },
                    );
                }}
                onInteractOutside={() => field.onBlur()}
                size="xs"
                variant={"subtle"}
                width="180px"
                lazyMount
                unmountOnExit
                disabled={isDisabled}
            >
                <Select.HiddenSelect />
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder={placeholder} />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        {isLoading && (
                            <Spinner
                                size="xs"
                                borderWidth="1.5px"
                                color="fg.muted"
                            />
                        )}
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {collection.items.map((variable) => (
                                <Select.Item key={variable.id} item={variable}>
                                    {variable.name}
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
