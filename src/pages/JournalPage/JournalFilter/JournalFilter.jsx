import { Accordion, Card, Span } from "@chakra-ui/react";
import { ArchiveFilter } from "./ArchiveFilter";
import { VariablesChoser } from "./VariablesChoser";
import { MessageTypes } from "./MessageTypes";
import { GroupFilter } from "./GroupFilter";
import { FilterControls } from "./FilterControls";

export const JournalFilter = () => {
    return (
        <Card.Root
            w={"30%"}
            maxH={"100%"}
            flexShrink={"1"}
            flexGrow={"1"}
            shadow={"xl"}
            data-state={"open"}
            overflow={"hidden"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <Card.Title>Фильтры</Card.Title>
            </Card.Header>
            <Card.Body
                gap={"2"}
                flex={"1"}
                display={"flex"}
                py={"1"}
                my={"1.5rem"}
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
            </Card.Body>
            <Card.Footer justifyContent={"space-between"}>
                <FilterControls />
            </Card.Footer>
        </Card.Root>
    );
};
