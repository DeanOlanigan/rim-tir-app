import { CloseButton, createOverlay, Dialog, Portal } from "@chakra-ui/react";

export const HELP_DIALOG_ID = "HELP_DIALOG_ID";
export const helpDialog = createOverlay((props) => {
    const { ...rest } = props;

    return (
        <Dialog.Root
            {...rest}
            placement={"center"}
            lazyMount
            unmountOnExit
            size={"lg"}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content h={"70vh"}>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size={"xs"} />
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>Справка</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body
                            display={"flex"}
                            flexDirection={"column"}
                            gap={4}
                        ></Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
