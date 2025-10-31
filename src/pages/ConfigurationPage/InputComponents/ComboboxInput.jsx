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
import { useVariablesCollectionMemo } from "@/store/selectors";
import { useVariablesStore } from "@/store/variables-store";

export const ComboboxInput = (props) => {
    const { id, value, reset = null, errors, ...rest } = props;

    const variables = useVariablesCollectionMemo(id);

    const { contains } = useFilter({ sensitivity: "base" });
    const { collection, filter, set } = useListCollection({
        initialItems: variables,
        filter: contains,
    });

    useEffect(() => {
        set(variables);
    }, [variables, set]);

    const inputValue = collection.find(value);

    return (
        <Combobox.Root
            lazyMount
            unmountOnExit
            size={"xs"}
            openOnClick
            collection={collection}
            value={[value]}
            inputValue={inputValue?.label}
            onInputValueChange={(e) => filter(e.inputValue)}
            onValueChange={(e) => {
                const nextId = e.value[0];
                if (nextId !== value) {
                    useVariablesStore.getState().bindVariable(id, nextId);
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
                            <Combobox.Item key={item.value} item={item}>
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
