import {
    Combobox,
    Portal,
    useFilter,
    useListCollection,
} from "@chakra-ui/react";
import { LOCALE } from "../constants";
import { useEffect } from "react";

export const VariableSelect = ({ variables, value, onChange, disabled }) => {
    const { contains } = useFilter({ sensitivity: "base" });

    const { collection, filter, set } = useListCollection({
        initialItems: variables || [],
        itemToString: (item) => item.name,
        itemToValue: (item) => item.id,
        filter: contains,
    });

    useEffect(() => {
        if (!variables) return;
        set(variables);
    }, [variables, set]);

    return (
        <Combobox.Root
            collection={collection}
            value={value ? [value] : []}
            onValueChange={(e) => onChange && onChange(e.value?.[0] ?? null)}
            onInputValueChange={(e) => filter(e.inputValue)}
            size={"xs"}
            disabled={disabled}
            lazyMount
            unmountOnExit
        >
            <Combobox.Control>
                <Combobox.Input placeholder={LOCALE.selectVariable} />
                <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.Empty>{LOCALE.noItemsFound}</Combobox.Empty>
                        {collection.items.map((item) => (
                            <Combobox.Item key={item.id} item={item}>
                                {item.name}
                                <Combobox.ItemIndicator />
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
};
