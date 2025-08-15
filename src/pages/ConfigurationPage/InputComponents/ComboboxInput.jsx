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

export const ComboboxInput = ({ id, reset = null }) => {
    console.log("Render ComboboxInput");
    const variables = useVariablesCollectionMemo();
    const val = variables.find((v) => v.usedIn === id)?.value;
    /* const [innerValue, setInnerValue] = useState(val ? [val] : []);
    console.log(innerValue); */

    const { contains } = useFilter({ sensitivity: "base" });
    const { collection, filter, set } = useListCollection({
        initialItems: variables,
        filter: contains,
        limit: 10,
    });

    useEffect(() => {
        set(variables);
    }, [variables, set]);

    const unbindVariable = useVariablesStore.getState().unbindVariable;
    const bindVariable = useVariablesStore.getState().bindVariable;
    // TODO значение переменной в самом поле ввода не меняется динамически
    return (
        <Combobox.Root
            lazyMount
            unmountOnExit
            size={"xs"}
            openOnClick
            collection={collection}
            defaultValue={val ? [val] : []}
            onInputValueChange={(e) => filter(e.inputValue)}
            onValueChange={(e) => {
                //setInnerValue(e.value);
                unbindVariable(id);
                if (e.value[0]) bindVariable(id, e.value[0]);
                reset && reset();
            }}
            open={reset ? true : null}
            onBlur={() => reset && reset()}
        >
            <Combobox.Control>
                <Combobox.Input placeholder={"Введите название переменной"} />
                <Combobox.IndicatorGroup>
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
                                {item.label}
                                {item.disabled && (
                                    <Badge colorPalette={"red"}>
                                        <LuBan />
                                    </Badge>
                                )}
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
};
