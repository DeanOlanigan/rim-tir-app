import { Card, Flex, Box } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { EditorWrapper } from "./EditorWrapper";
import { BaseConfCard } from "../BaseConfCard/BaseConfCard";
import { LuGripVertical } from "react-icons/lu";
import { useConfigStore } from "../stores";

export const EditorCard = () => {
    const flip = useConfigStore((state) => state.flip);
    return (
        <Flex w={"100%"} h={"100%"} direction={"column"} gap={"1"}>
            <BaseConfCard />
            <Card.Root
                h={"100%"}
                size={"sm"}
                data-state={"open"}
                animationDuration={"slow"}
                animationStyle={{
                    _open: "scale-fade-in",
                }}
                border={"none"}
                bg={"transparent"}
            >
                <Card.Body overflow={"auto"} w={"100%"} h={"100%"}>
                    <PanelGroup direction={flip}>
                        <Panel collapsible collapsedSize={0} minSize={30}>
                            <Box
                                w={"100%"}
                                h={"100%"}
                                position={"relative"}
                                p={"4"}
                            >
                                <EditorWrapper type={"connections"} />
                            </Box>
                        </Panel>
                        <PanelResizeHandle className="PanelResizeHandle">
                            <div className="PanelResizeGrip">
                                <LuGripVertical />
                            </div>
                        </PanelResizeHandle>
                        <Panel collapsible collapsedSize={0} minSize={30}>
                            <Box w={"100%"} h={"100%"} p={"4"}>
                                <EditorWrapper type={"variables"} />
                            </Box>
                        </Panel>
                    </PanelGroup>
                </Card.Body>
            </Card.Root>
        </Flex>
    );
};
