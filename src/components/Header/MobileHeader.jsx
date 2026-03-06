import {
    Container,
    Drawer,
    HStack,
    IconButton,
    Portal,
} from "@chakra-ui/react";
import { LuClock3, LuCpu, LuMemoryStick, LuMenu } from "react-icons/lu";
import { Connect } from "../Metrics/Connect";
import { StatusTile } from "../Sidebar/StatusTile";
import { AlertJournal } from "../Sidebar/AlertJournal";
import { MobileSidebarContent } from "./MobileSidebarContent";
import { useState } from "react";

export const MobileHeader = () => {
    const [open, setOpen] = useState(false);
    return (
        <Container
            maxW="full"
            px="4"
            py="1"
            bg="bg.panel"
            borderBottomWidth="1px"
        >
            <HStack justify="space-between">
                <HStack flex={1}>
                    <Connect />
                    <StatusTile
                        icon={LuClock3}
                        label={"Время"}
                        sub={"stats/time"}
                        color={"green"}
                        format={(value) => new Date(value).toLocaleTimeString()}
                        collapsed={false}
                    />
                    <StatusTile
                        icon={LuCpu}
                        label={"CPU"}
                        sub={"stats/cpu"}
                        color={"purple"}
                        collapsed={false}
                    />
                    <StatusTile
                        icon={LuMemoryStick}
                        label={"RAM"}
                        sub={"stats/ram"}
                        color={"orange"}
                        collapsed={false}
                    />
                    <AlertJournal collapsed={true} />
                </HStack>

                <Drawer.Root
                    open={open}
                    onOpenChange={(e) => setOpen(e.open)}
                    placement="start"
                    lazyMount
                    unmountOnExit
                >
                    <Drawer.Trigger asChild>
                        <IconButton aria-label="Открыть меню" variant="ghost">
                            <LuMenu />
                        </IconButton>
                    </Drawer.Trigger>

                    <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content>
                                <Drawer.Header />
                                <Drawer.Body p="0">
                                    <MobileSidebarContent setOpen={setOpen} />
                                </Drawer.Body>
                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>
                </Drawer.Root>
            </HStack>
        </Container>
    );
};
