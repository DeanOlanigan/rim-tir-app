import { LOCALE } from "@/pages/HMIEditor/constants";
import {
    Button,
    CloseButton,
    createOverlay,
    Dialog,
    Portal,
} from "@chakra-ui/react";

export const CONFIRM_DIALOG_ID = "CONFIRM_DIALOG_ID";

export const confirmDialog = createOverlay((props) => {
    const {
        title,
        message,
        confirmationText = LOCALE.apply,
        cancelText = LOCALE.cancel,
        onAccept = () => {},
        onCancel = () => {},
        ...rest
    } = props;

    const handleComfirm = () => {
        onAccept();
        confirmDialog.close(CONFIRM_DIALOG_ID, true);
    };

    const handleCancel = () => {
        onCancel();
        confirmDialog.close(CONFIRM_DIALOG_ID, false);
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
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>{message}</Dialog.Body>
                        <Dialog.Footer>
                            <Button size={"xs"} onClick={handleComfirm}>
                                {confirmationText}
                            </Button>
                            <Button
                                variant={"ghost"}
                                size={"xs"}
                                onClick={handleCancel}
                            >
                                {cancelText}
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
