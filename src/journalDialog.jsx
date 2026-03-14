import { CloseButton, createOverlay, Dialog, Portal } from "@chakra-ui/react";
import { JournalHeader } from "./pages/JournalPage/JournalView/JournalView";
import { JournalTable } from "./pages/JournalPage/JournalView/JournalTable";

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
                            <Dialog.Title>Журналы</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body
                            h={"100%"}
                            p={2}
                            gap={2}
                            overflow={"hidden"}
                            display={"flex"}
                            flexDirection={"column"}
                        >
                            <JournalHeader />
                            <JournalTable />
                        </Dialog.Body>
                        <Dialog.Footer></Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
