import {
    Button,
    Group,
    IconButton,
    Popover,
    Portal,
    Stack,
} from "@chakra-ui/react";
import { LuDownload, LuFile, LuMenu } from "react-icons/lu";
import { Checkboxes } from "./CheckBoxes";
import { GridSize } from "./GridSize";
import { Colors } from "./Colors";
import { CloseProject, DownloadProject, OpenProject } from "../ProjectOps";

export const EditorSettings = ({ tools, width, height }) => {
    return (
        <Popover.Root size={"xs"} lazyMount unmountOnExit>
            <Popover.Trigger asChild>
                <IconButton size={"xs"} variant={"ghost"}>
                    <LuMenu />
                </IconButton>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Body>
                            <Stack>
                                <Group>
                                    <DownloadProject>
                                        <Button size={"xs"} variant={"surface"}>
                                            <LuDownload />
                                            Download project
                                        </Button>
                                    </DownloadProject>
                                    <OpenProject
                                        tools={tools}
                                        width={width}
                                        height={height}
                                    >
                                        <Button
                                            size={"xs"}
                                            variant={"surface"}
                                            w={"100%"}
                                        >
                                            <LuFile />
                                            Open project
                                        </Button>
                                    </OpenProject>
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
