import { Accordion, Span, Drawer, Button, CloseButton } from "@chakra-ui/react";
import { ArchiveFilter } from "./ArchiveFilter";
import { VariablesChoser } from "./VariablesChoser";
import { MessageTypes } from "./MessageTypes";
import { GroupFilter } from "./GroupFilter";
import { FilterControls } from "./FilterControls";

export const JournalFilter = () => {
    
    return (
        <Drawer.Root>
            <Drawer.Trigger asChild>
                <Button size={"xs"} variant={"solid"}>
                    Фильтрация
                </Button>
            </Drawer.Trigger>
            <Drawer.Backdrop bg="blackAlpha.600" />
            <Drawer.Positioner padding="4">
                <Drawer.Content rounded="md">
                    <Drawer.Header borderBottom={"2px solid #e2e8f0"}>
                        <Drawer.Title>Фильтры</Drawer.Title>
                        <Drawer.CloseTrigger top="5">
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Header>
                    <Drawer.Body
                        gap={"1"}
                        flex={"1"}
                        display={"flex"}
                        py={"1"}
                        overflow={"auto"}
                        flexDirection={"column"}
                        minH={"0"}
                    >
                        <Accordion.Root multiple size={"sm"}>
                            <Accordion.Item value="1">
                                <Accordion.ItemTrigger>
                                    <Span flex={1}>Архив</Span>
                                    <Accordion.ItemIndicator />
                                </Accordion.ItemTrigger>
                                <Accordion.ItemContent>
                                    <ArchiveFilter />
                                </Accordion.ItemContent>
                            </Accordion.Item>
                            <Accordion.Item value="2">
                                <Accordion.ItemTrigger>
                                    <Span flex={1}>Группы</Span>
                                    <Accordion.ItemIndicator />
                                </Accordion.ItemTrigger>
                                <Accordion.ItemContent>
                                    <GroupFilter />
                                </Accordion.ItemContent>
                            </Accordion.Item>
                            <Accordion.Item value="3">
                                <Accordion.ItemTrigger>
                                    <Span flex={1}>Типы сообщений</Span>
                                    <Accordion.ItemIndicator />
                                </Accordion.ItemTrigger>
                                <Accordion.ItemContent>
                                    <MessageTypes />
                                </Accordion.ItemContent>
                            </Accordion.Item>
                        </Accordion.Root>
                        <VariablesChoser />
                    </Drawer.Body>
                    <Drawer.Footer justifyContent={"space-between"}>
                        <FilterControls />
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    );
};