import { Button, createOverlay, Dialog, Portal } from "@chakra-ui/react";

export const CONFIRMATION_DIALOG_ID = "CONFIRMATION_DIALOG_ID";

export const confirmationDialog = createOverlay((props) => {
    const {
        title,
        message,
        confirmationText = "OK",
        cancelText = "Cancel",
        ...rest
    } = props;

    const handleComfirm = () => {
        confirmationDialog.close(CONFIRMATION_DIALOG_ID, true);
    };

    const handleCancel = () => {
        confirmationDialog.close(CONFIRMATION_DIALOG_ID, false);
    };

    return (
        <Dialog.Root
            {...rest}
            placement={"center"}
            lazyMount
            unmountOnExit
            onOpenChange={(details) => !details.open && handleCancel()}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>{message}</Dialog.Body>
                        <Dialog.Footer>
                            <Button onClick={handleComfirm}>
                                {confirmationText}
                            </Button>
                            <Button onClick={handleCancel}>{cancelText}</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
