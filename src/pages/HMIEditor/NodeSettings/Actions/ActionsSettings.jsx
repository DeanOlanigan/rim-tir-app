import { Accordion, Span, VStack } from "@chakra-ui/react";
import { useNodeStore } from "../../store/node-store";
import { EVENT_TYPES } from "./constants";
import { ActionEvents } from "./ActionEvents";
import { AddActionBtn } from "./AddActionBtn";

export const ActionsSettings = ({ selectedIds }) => {
    const selectedNode = useNodeStore((s) => s.nodes[selectedIds[0]]);

    return (
        <VStack align={"start"} p={2} w={"100%"}>
            <Accordion.Root collapsible multiple>
                {EVENT_TYPES.map((action, index) => (
                    <Accordion.Item key={index} value={action.id}>
                        <Accordion.ItemTrigger px={2}>
                            <Span flex="1">{action.label}</Span>
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
                                    actionId={action.id}
                                    mockState={selectedNode}
                                />
                                <AddActionBtn
                                    actionId={action.id}
                                    mockState={selectedNode}
                                />
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </VStack>
    );
};
