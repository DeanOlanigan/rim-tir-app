import { TREE_TYPES } from "@/config/constants";
import { useVariablesCollectionMemo } from "@/hooks/useVariablesCollection";
import { useVariablesStore } from "@/store/variables-store";
import {
    useListCollection,
    useFilter,
    Portal,
    Combobox,
    Badge,
    Icon,
    Flex,
    Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { LuBan, LuCircleHelp } from "react-icons/lu";
import { ErrorSign } from "./ErrorSign";

export const ComboboxInput = (props) => {
    console.log("Render ComboboxInput");
    const { id, value, reset = null, errors, ...rest } = props;

    const rootId = useVariablesStore((state) => state.settings[id]?.rootId);

    const variables = useVariablesCollectionMemo(rootId, id);

    const { contains } = useFilter({ sensitivity: "base" });
    const { collection, filter, set } = useListCollection({
        initialItems: variables,
        filter: contains,
        limit: 10,
    });

    useEffect(() => {
        set(variables);
    }, [variables, set]);

    const { bindVariable } = useVariablesStore.getState();

    if (!rootId || rootId === TREE_TYPES.variables) return null;

    // TODO значение переменной в самом поле ввода не меняется динамически
    return (
        <Combobox.Root
            lazyMount
            unmountOnExit
            size={"xs"}
            openOnClick
            collection={collection}
            defaultValue={value ? [value] : []}
            onInputValueChange={(e) => filter(e.inputValue)}
            onValueChange={(e) => {
                const nextId = e.value[0];
                if (nextId !== value) {
                    bindVariable(id, nextId);
                }
                reset && reset();
            }}
            open={reset ? true : null}
            onBlur={() => reset && reset()}
        >
            <Combobox.Control>
                <Combobox.Input
                    pe={"6"}
                    truncate
                    placeholder={"Введите название переменной"}
                    {...rest}
                />
                <Combobox.IndicatorGroup>
                    {errors && errors.size !== 0 && (
                        <ErrorSign errors={errors} />
                    )}
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.Empty>
                            <Flex direction={"column"} align={"center"}>
                                <Icon
                                    size={"lg"}
                                    color={"fg.muted"}
                                    as={LuCircleHelp}
                                />
                                <Text color={"fg.muted"}>
                                    Ничего не найдено
                                </Text>
                            </Flex>
                        </Combobox.Empty>
                        {collection.items.map((item) => (
                            <Combobox.Item item={item} key={item.value}>
                                <Combobox.ItemIndicator />
                                {item.disabled && (
                                    <Badge colorPalette={"red"}>
                                        <LuBan />
                                    </Badge>
                                )}
                                {item.label}
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
};
