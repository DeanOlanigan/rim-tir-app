import { createListCollection, Portal, Select } from "@chakra-ui/react";
import { useLogStore } from "../store/store";

const rows = createListCollection({
    items: [
        { label: "100", value: 100 },
        { label: "250", value: 250 },
        { label: "500", value: 500 },
        { label: "1000", value: 1000 },
        { label: "2500", value: 2500 },
        { label: "5000", value: 5000 },
    ],
});

export const LogFileViewerControls = () => {
    const value = useLogStore((state) => state.logRowsCount);
    const { setLogRowsCount } = useLogStore.getState();

    return (
        <Select.Root
            collection={rows}
            defaultValue={[value]}
            onValueChange={(e) => setLogRowsCount(e.value[0])}
            size={"xs"}
            maxW={"xs"}
            unmountOnExit
            lazyMount
        >
            <Select.HiddenSelect />
            <Select.Label>Количество отображаемых строк:</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {rows.items.map((row) => (
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
