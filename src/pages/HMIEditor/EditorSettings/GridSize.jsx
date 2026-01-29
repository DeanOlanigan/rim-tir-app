import { Field, NumberInput } from "@chakra-ui/react";
import { useActionsStore } from "../store/actions-store";

export const GridSize = () => {
    const gridSize = useActionsStore((state) => state.gridSize);

    const handleChange = (e) => {
        const value = Number.isNaN(e.valueAsNumber) ? 1 : e.valueAsNumber;
        useActionsStore.getState().setGridSize(value);
    };

    return (
        <Field.Root maxW={"3xs"}>
            <Field.Label>Размер сетки</Field.Label>
            <NumberInput.Root
                w={"100%"}
                size={"xs"}
                value={gridSize}
                onValueChange={handleChange}
                min={1}
            >
                <NumberInput.Control />
                <NumberInput.Input />
            </NumberInput.Root>
        </Field.Root>
    );
};
