import { Button, Dialog, IconButton, Portal } from "@chakra-ui/react";
import { LuUserRoundPen } from "react-icons/lu";
import { UserEditor } from "../UserEditor";

export const EditDialog = () => {
    return (
        <Dialog.Root placement="center" size={"xl"}>
            <Dialog.Trigger>
                <IconButton size={"sm"} variant={"outline"} w={"50px"}>
                    <LuUserRoundPen />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Редактирование выбранных пользователей
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body overflow={"auto"}>
                            <UserEditor />
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button>Применить</Button>
                            <Button>Отменить</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
