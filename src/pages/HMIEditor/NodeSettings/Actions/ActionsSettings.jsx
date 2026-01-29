import { Accordion, Span, VStack } from "@chakra-ui/react";
import { useNodeStore } from "../../store/node-store";
import { EVENT_TYPES } from "./constants";
import { ActionEvents } from "./ActionEvents";
import { AddActionBtn } from "./AddActionBtn";

export const ActionsSettings = ({ selectedIds }) => {
    const selectedNode = useNodeStore((s) => s.nodes[selectedIds[0]]);

    return (
        <VStack align={"start"} p={2} w={"100%"}>
            <Accordion.Root collapsible multiple lazyMount unmountOnExit>
                {EVENT_TYPES.map((event, index) => (
                    <Accordion.Item
                        key={index}
                        value={event.type}
                        disabled={event.disabled}
                    >
                        <Accordion.ItemTrigger px={2}>
                            <Span flex="1">{event.label}</Span>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody
                                display={"flex"}
                                flexDirection={"column"}
                                gap={2}
                                px={2}
                            >
                                <ActionEvents
                                    eventType={event.type}
                                    selectedNode={selectedNode}
                                />
                                <AddActionBtn
                                    eventType={event.type}
                                    selectedNode={selectedNode}
                                />
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </VStack>
    );
};
