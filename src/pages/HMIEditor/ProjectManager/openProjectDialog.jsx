import { CloseButton, createOverlay, Dialog, Portal } from "@chakra-ui/react";
import { ProjectCardList } from "./ProjectCardList";
import { useOpeningState } from "./useOpeningState";
import { LOCALE } from "../constants";

export const OPEN_PROJECT_DIALOG_ID = "OPEN_PROJECT_DIALOG_ID";

export const openProjectDialog = createOverlay((props) => {
    const { onOpenChange, ...rest } = props;
    const { openingMutation } = useOpeningState();

    return (
        <Dialog.Root
            {...rest}
            onOpenChange={onOpenChange}
            size={"lg"}
            placement={"center"}
            lazyMount
            unmountOnExit
            closeOnInteractOutside={openingMutation.length === 0}
            closeOnEscape={openingMutation.length === 0}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content h={"70vh"}>
                        {openingMutation.length === 0 && (
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size={"xs"} />
                            </Dialog.CloseTrigger>
                        )}
                        <Dialog.Header>
                            <Dialog.Title>{LOCALE.projectManager}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body
                            overflowY={"auto"}
                            display={"flex"}
                            flexDirection={"column"}
                            gap={2}
                        >
                            <ProjectCardList
                                tools={rest.tools}
                                onOpenChange={onOpenChange}
                            />
                        </Dialog.Body>
                        <Dialog.Footer></Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
