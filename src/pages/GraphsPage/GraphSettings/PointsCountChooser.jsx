import { Portal, Select } from "@chakra-ui/react";
import { useGraphStore } from "../store/store";
import { points as pointsList } from "./graphSettingsConstants";

export const PointsCountChooser = () => {
    const points = useGraphStore((state) => state.points);
    const { setPoints } = useGraphStore.getState();

    return (
        <Select.Root
            size={"xs"}
            maxW={"2xs"}
            collection={pointsList}
            value={[points]}
            onValueChange={(e) => {
                setPoints(e.value[0]);
            }}
        >
            <Select.HiddenSelect />
            <Select.Label>Количество точек</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Выберите количество точек" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {pointsList.items.map((row) => (
                            <Select.Item item={row} key={row.value}>
                                {row.label}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};
