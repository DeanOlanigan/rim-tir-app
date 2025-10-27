import { Accordion, Span, Collapsible, IconButton, Card } from "@chakra-ui/react";
import { ArchiveFilter } from "./ArchiveFilter";
import { VariablesChoser } from "./VariablesChoser";
import { MessageTypes } from "./MessageTypes";
import { GroupFilter } from "./GroupFilter";
import { FilterControls } from "./FilterControls";
import { LuArrowLeft } from "react-icons/lu";
import { useState } from "react";

export const JournalFilterDeux = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible.Root>
            <Collapsible.Trigger>
                <IconButton 
                    onClick={() => setIsOpen(!isOpen)} 
                    size={"xs"} 
                    top={"10"} 
                    left={isOpen ? "-6" : "5"}
                    transition={"left 0.5s ease"}
                >
                    <LuArrowLeft style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(360deg)",
                        transition: "transform 0.4s ease"
                    }}/>
                </IconButton>
            </Collapsible.Trigger>
            <Collapsible.Content>
                <Card.Root
                    maxH={"100%"}
                    flexShrink={"1"}
                    flexGrow={"1"}
                    shadow={"xl"}
                    data-state={"open"}
                    overflow={"clip"}
                    animationDuration={"slow"}
                    animationStyle={{
                        _open: "scale-fade-in",
                        _closed: "scale-fade-out"
                    }}  
                >
                    <Card.Header borderBottom={"2px solid #e2e8f0"}>
                        <Card.Title>Фильтры</Card.Title>
                    </Card.Header>
                    <Card.Body
                        gap={"2"}
                        flex={"1"}
                        display={"flex"}
                        py={"0"}
                        my={"0.5rem"}
                        overflow={"clip"}
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
                        <Card.Footer justifyContent={"space-between"} padding={"3"}>
                            <FilterControls />
                        </Card.Footer>
                    </Card.Body>
                </Card.Root>
            </Collapsible.Content>
        </Collapsible.Root>
    );
};