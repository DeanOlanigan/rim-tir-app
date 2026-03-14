import { CloseButton, createOverlay, Dialog, Portal } from "@chakra-ui/react";
import { JournalLiveTable } from "./pages/JournalPage/JournalLiveTable";
import { JournalLiveHeader } from "./pages/JournalPage/JournalView/JournalLiveHeader";

export const JOURNAL_DIALOG_ID = "JOURNAL_DIALOG_ID";
export const journalDialog = createOverlay((props) => {
    const { ...rest } = props;

    return (
        <Dialog.Root
            {...rest}
            placement={"top"}
            lazyMount
            unmountOnExit
            size={"lg"}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content h={"80vh"} maxW={"60vw"}>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size={"xs"} />
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>
                                События в реальном времени
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body
                            h={"100%"}
                            p={2}
                            gap={2}
                            overflow={"hidden"}
                            display={"flex"}
                            flexDirection={"column"}
                        >
                            <JournalLiveHeader />
                            <JournalLiveTable />
                        </Dialog.Body>
                        <Dialog.Footer></Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
