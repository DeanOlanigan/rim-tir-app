import {
    CloseButton,
    createOverlay,
    Dialog,
    Heading,
    Portal,
    Tabs,
    Text,
    VStack,
} from "@chakra-ui/react";
import { HotkeyHelp } from "./HotkeyHelp";

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
                    <Dialog.Content h={"60vh"} maxW={"60vw"}>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size={"xs"} />
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>Справка</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body h={"100%"} p={0} overflow={"hidden"}>
                            <Tabs.Root
                                defaultValue="hotkeys"
                                lazyMount
                                unmountOnExit
                                display={"flex"}
                                flexDirection={"column"}
                                h={"100%"}
                            >
                                <Tabs.List>
                                    <Tabs.Trigger value="hotkeys">
                                        Горячие клавиши
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="help">
                                        Помощь
                                    </Tabs.Trigger>
                                </Tabs.List>
                                <Tabs.Content
                                    value="hotkeys"
                                    flex={1}
                                    overflow={"auto"}
                                    p={6}
                                >
                                    <HotkeyHelp />
                                </Tabs.Content>
                                <Tabs.Content
                                    value="help"
                                    flex="1"
                                    overflowY="auto"
                                    p={6}
                                >
                                    <VStack align="start" spacing={4}>
                                        <Heading size="sm" color={"fg.muted"}>
                                            О редакторе
                                        </Heading>
                                        <Text color={"fg.subtle"}>
                                            Здесь может быть описание работы с
                                            редактором, ссылки на документацию
                                            или видеоуроки.
                                        </Text>
                                    </VStack>
                                </Tabs.Content>
                            </Tabs.Root>
                        </Dialog.Body>
                        <Dialog.Footer></Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
