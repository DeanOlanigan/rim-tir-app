import { useConfigInfoStore } from "@/store/config-info-store";
import { useValidationStore } from "@/store/validation-store";
import { useVariablesStore } from "@/store/variables-store";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useState } from "react";

export const AreYouShureDialog = ({ children }) => {
    const [open, setOpen] = useState(false);
    const acceptHandler = () => {
        useVariablesStore.getState().resetState();
        useConfigInfoStore.setState({
            configInfo: {},
        });
        useValidationStore.getState().clearErrors();
        setOpen(false);
    };

    const rejectHandler = () => setOpen(false);

    return (
        <Dialog.Root
            lazyMount
            unmountOnExit
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            placement={"center"}
            size={"xs"}
            role={"alertdialog"}
        >
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size={"sm"} />
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>Вы уверены?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Footer>
                            <Button size={"xs"} onClick={acceptHandler}>
                                Применить
                            </Button>
                            <Button size={"xs"} onClick={rejectHandler}>
                                Отмена
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
