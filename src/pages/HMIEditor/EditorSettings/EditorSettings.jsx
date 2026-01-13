import { Group, IconButton, Popover, Portal, Stack } from "@chakra-ui/react";
import { LuMenu } from "react-icons/lu";
import { Checkboxes } from "./CheckBoxes";
import { GridSize } from "./GridSize";
import { Colors } from "./Colors";
import { DownloadProject } from "./DownloadProject";
import { OpenProject } from "./OpenProject";
import { CloseProject } from "./CloseProject";

export const EditorSettings = () => {
    return (
        <Popover.Root size={"xs"} lazyMount unmountOnExit>
            <Popover.Trigger asChild>
                <IconButton size={"xs"} variant={"subtle"} shadow={"md"}>
                    <LuMenu />
                </IconButton>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Body>
                            <Stack>
                                <Group>
                                    <DownloadProject />
                                    <OpenProject />
                                    <CloseProject />
                                </Group>
                                <GridSize />
                                <Checkboxes />
                                <Colors />
                            </Stack>
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
