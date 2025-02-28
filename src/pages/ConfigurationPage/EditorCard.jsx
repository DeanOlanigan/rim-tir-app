import { Card, Stack, StackSeparator, Text, Box } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { VariableMenu } from "./VariableEditor/VariableMenu";
import { config } from "../../config/testData";

export const EditorCard = () => {
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
                        <Text>{config.name}</Text>
                        <Text>{config.setting.description}</Text>
                        <Text>{config.setting.date}</Text>
                        <Text>{config.setting.version}</Text>
                    </Stack>
                </Card.Title>
            </Card.Header>
            <Card.Body overflow={"auto"} w={"100%"} h={"100%"}>
                <PanelGroup direction="vertical">
                    <Panel collapsible collapsedSize={0} minSize={30}>
                        <Box w={"100%"} h={"100%"} pb={"2"}>
                            {/* <ConfigurationEditor data={selectedNode} /> */}
                        </Box>
                    </Panel>
                    <PanelResizeHandle className="verticalLineConf" />
                    <Panel collapsible collapsedSize={0} minSize={30}>
                        <Box w={"100%"} h={"100%"} pt={"2"}>
                            {/* TODO Унифицировать компонент */}
                            <VariableMenu />
                        </Box>
                    </Panel>
                </PanelGroup>
            </Card.Body>
        </Card.Root>
    );
};
