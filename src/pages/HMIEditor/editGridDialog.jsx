import {
    Button,
    CloseButton,
    ColorPicker,
    createOverlay,
    Dialog,
    Field,
    Flex,
    NumberInput,
    parseColor,
    Portal,
} from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { useEffect } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const EDIT_GRID_DIALOG_ID = "EDIT_GRID_DIALOG_ID";

const gridSchema = z.object({
    gridSize: z.number().min(1, "Размер сетки должен быть не менее 1"),
    gridColor: z.string(),
});

export const editGridDialog = createOverlay((props) => {
    const { ...rest } = props;

    const gridSize = useActionsStore((state) => state.gridSize);
    const gridColor = useActionsStore((state) => state.gridColor);
    const setGridSize = useActionsStore((state) => state.setGridSize);
    const setGridColor = useActionsStore((state) => state.setGridColor);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(gridSchema),
        defaultValues: {
            gridSize,
            gridColor,
        },
    });

    useEffect(() => {
        if (props.open) {
            reset({
                gridSize,
                gridColor,
            });
        }
    }, [props.open, reset, gridSize, gridColor]);

    const onSubmit = (data) => {
        setGridSize(data.gridSize);
        setGridColor(data.gridColor);
        props.onOpenChange?.({ open: false });
    };

    return (
        <Dialog.Root {...rest} placement={"center"} lazyMount unmountOnExit>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size={"xs"} />
                        </Dialog.CloseTrigger>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Dialog.Header>
                                <Dialog.Title>Настройки сетки</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Flex direction={"column"} gap={4}>
                                    {/* --- Размер сетки --- */}
                                    <Field.Root invalid={!!errors.gridSize}>
                                        <Field.Label>Размер сетки</Field.Label>
                                        <Controller
                                            control={control}
                                            name="gridSize"
                                            render={({ field }) => (
                                                <NumberInput.Root
                                                    size="xs"
                                                    w="100%"
                                                    min={1}
                                                    max={100}
                                                    value={field.value}
                                                    onValueChange={(e) =>
                                                        field.onChange(
                                                            e.valueAsNumber,
                                                        )
                                                    }
                                                >
                                                    <NumberInput.Control />
                                                    <NumberInput.Input />
                                                </NumberInput.Root>
                                            )}
                                        />
                                        <Field.ErrorText>
                                            {errors.gridSize?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                    {/* --- Цвет сетки --- */}
                                    <Field.Root invalid={!!errors.gridColor}>
                                        <Controller
                                            control={control}
                                            name="gridColor"
                                            render={({ field }) => (
                                                <ColorPicker.Root
                                                    size="xs"
                                                    value={parseColor(
                                                        field.value,
                                                    )}
                                                    onValueChange={(e) =>
                                                        field.onChange(
                                                            e.valueAsString,
                                                        )
                                                    }
                                                >
                                                    <ColorPicker.HiddenInput />
                                                    <ColorPicker.Label>
                                                        Цвет линий
                                                    </ColorPicker.Label>
                                                    <ColorPicker.Control>
                                                        <ColorPicker.Trigger />
                                                        <ColorPicker.Input />
                                                    </ColorPicker.Control>
                                                    <ColorPicker.Positioner>
                                                        <ColorPicker.Content>
                                                            <ColorPicker.Area />
                                                            <ColorPicker.Sliders />
                                                        </ColorPicker.Content>
                                                    </ColorPicker.Positioner>
                                                </ColorPicker.Root>
                                            )}
                                        />
                                    </Field.Root>
                                </Flex>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Button
                                    type="submit"
                                    size="xs"
                                    disabled={!isDirty}
                                >
                                    Применить
                                </Button>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="ghost" size="xs">
                                        Отмена
                                    </Button>
                                </Dialog.ActionTrigger>
                            </Dialog.Footer>
                        </form>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
