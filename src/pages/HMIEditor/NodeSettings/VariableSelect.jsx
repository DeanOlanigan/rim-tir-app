import {
    Combobox,
    Portal,
    useFilter,
    useListCollection,
} from "@chakra-ui/react";

export const VariableSelect = ({ variables, value, onChange, disabled }) => {
    const { contains } = useFilter({ sensitivity: "base" });

    const { collection, filter } = useListCollection({
        initialItems: variables || [],
        filter: contains,
    });

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
                <Combobox.Input placeholder="Select variable" />
                <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.Empty>No items found</Combobox.Empty>
                        {collection.items.map((item) => (
                            <Combobox.Item key={item.value} item={item}>
                                {item.label}
                                <Combobox.ItemIndicator />
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
};
