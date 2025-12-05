import { IconButton, Popover, Portal, Stack } from "@chakra-ui/react";
import { LuMenu } from "react-icons/lu";
import { Checkboxes } from "./CheckBoxes";
import { GridSize } from "./GridSize";
import { Colors } from "./Colors";

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
