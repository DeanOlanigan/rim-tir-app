import { Portal, Select } from "@chakra-ui/react";
import { offsets } from "../graphSettingsConstants";
import { useGraphStore } from "../../store/store";

export const OffsetPicker = () => {
    const offset = useGraphStore((state) => state.offset);
    const setOffset = useGraphStore.getState().setOffset;

    return (
        <Select.Root
            size={"xs"}
            maxW={"2xs"}
            collection={offsets}
            value={[offset]}
            onValueChange={(e) => {
                setOffset(e.value[0]);
            }}
            lazyMount
            unmountOnExit
        >
            <Select.HiddenSelect />
            <Select.Label>Оффсет</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Выберите оффсет" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {offsets.items.map((row) => (
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
