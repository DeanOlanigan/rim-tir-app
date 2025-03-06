import { Card, Stack, StackSeparator, Text, Box } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { EditorWrapper } from "./Editor/EditorWrapper";
import { useVariablesStore } from "../../store/variables-store";

export const EditorCard = () => {
    const configInfo = useVariablesStore((state) => state.configInfo);
    const settings = useVariablesStore(
        (state) => state.settings[configInfo.id]
    );

    return (
        <Card.Root
            h={"100%"}
            size={"sm"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <Card.Title>
                    <Stack direction={"row"} separator={<StackSeparator />}>
                        <Text>{settings.name}</Text>
                        <Text>{settings.setting.description}</Text>
                        <Text>{settings.setting.date}</Text>
                        <Text>{settings.setting.version}</Text>
                    </Stack>
                </Card.Title>
            </Card.Header>
            <Card.Body overflow={"auto"} w={"100%"} h={"100%"}>
                <PanelGroup direction="vertical">
                    <Panel collapsible collapsedSize={0} minSize={30}>
                        <Box w={"100%"} h={"100%"} pb={"2"}>
                            <EditorWrapper type={"connections"} />
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
    );
};
