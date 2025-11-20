import { Button, Dialog, IconButton, Portal } from "@chakra-ui/react";
import { LuUserRoundX } from "react-icons/lu";
import { useTableStore } from "../SettingsStore/tablestore";

export const DeleteDialog = () => {
    const deleteUsers = useTableStore((state) => state.deleteUsers);

    return (
        <Dialog.Root
            placement={"center"}
            role="alertdialog"
            motionPreset={"slide-in-bottom"}
            closeOnInteractOutside={"true"}
        >
            <Dialog.Trigger asChild>
                <IconButton
                    size={"sm"}
                    variant={"outline"}
                    w={"50px"}
                    colorPalette={"red"}
                >
                    <LuUserRoundX />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Вы уверены?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>
                                Это действие не может быть отменено! Выбранные
                                пользователи будут удалены навсегда!
                            </p>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                variant={"outline"}
                                colorPalette={"red"}
                                size="sm"
                                onClick={() => deleteUsers()}
                            >
                                Удалить
                            </Button>
                            <Dialog.ActionTrigger asChild>
                                <Button variant={"outline"} size="sm">
                                    Отмена
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
