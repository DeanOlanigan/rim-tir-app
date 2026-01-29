import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useState } from "react";

export const AreYouShureDialog = ({
    children,
    onAccept = () => {},
    onReject = () => {},
    header,
    message,
}) => {
    const [open, setOpen] = useState(false);
    const acceptHandler = () => {
        onAccept();
        setOpen(false);
    };

    const rejectHandler = () => {
        onReject();
        setOpen(false);
    };

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
                            <Dialog.Title>{header}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>{message}</Dialog.Body>
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
