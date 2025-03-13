import { Card, Flex, Box } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { EditorWrapper } from "./Editor/EditorWrapper";
import { BaseConfCard } from "./BaseConfCard/BaseConfCard";

export const EditorCard = () => {
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
            >
                <Card.Body overflow={"auto"} w={"100%"} h={"100%"}>
                    <PanelGroup direction="vertical">
                        <Panel collapsible collapsedSize={0} minSize={30}>
                            <Box
                                w={"100%"}
                                h={"100%"}
                                pb={"2"}
                                position={"relative"}
                            >
                                {/* <EditorWrapper type={"connections"} /> */}
                            </Box>
                        </Panel>
                        <PanelResizeHandle className="verticalLineConf" />
                        <Panel collapsible collapsedSize={0} minSize={30}>
                            <Box w={"100%"} h={"100%"} pt={"2"}>
                                <EditorWrapper type={"variables"} />
                            </Box>
                        </Panel>
                    </PanelGroup>
                </Card.Body>
            </Card.Root>
        </Flex>
    );
};
