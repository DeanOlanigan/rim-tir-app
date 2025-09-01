import { getConfiguration } from "@/api/configuration";
import { QK } from "@/api/queryKeys";
import { configuratorConfig } from "@/utils/configurationParser";
import {
    Badge,
    CloseButton,
    Drawer,
    Heading,
    HStack,
    IconButton,
    Portal,
    ScrollArea,
    SimpleGrid,
    Stack,
    StackSeparator,
    Text,
    Wrap,
} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useQuery } from "@tanstack/react-query";
import { LuInfo } from "react-icons/lu";

export const AdditionalInfo = ({ id }) => {
    const {
        data: { setting, path },
    } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => state.settings[id],
    });

    if (!setting) return null;
    const config = configuratorConfig.nodePaths[path];

    const drawerBodyHeight = "12rem";
    const blockHeight = "10rem";

    const renderDesc =
        setting.description && config?.settings["description"] ? (
            <DescriptionField
                setting={setting}
                config={config}
                w={"100%"}
                h={blockHeight}
            />
        ) : null;
    const renderCode =
        setting.luaExpression && config?.settings["luaExpression"] ? (
            <CodeField
                setting={setting}
                config={config}
                w={"100%"}
                h={blockHeight}
            />
        ) : null;
    const renderInfoBlock = (
        <InfoBlock setting={setting} config={config} h={blockHeight} />
    );

    return (
        <Drawer.Root placement={"bottom"} unmountOnExit lazyMount>
            <Drawer.Trigger asChild>
                <IconButton size={"2xs"} variant={"subtle"}>
                    <LuInfo />
                </IconButton>
            </Drawer.Trigger>
            <Portal>
                {/* <Drawer.Backdrop /> */}
                <Drawer.Positioner p={"4"} justifyContent={"center"}>
                    <Drawer.Content rounded={"md"} maxW={"4xl"}>
                        <Drawer.Header>
                            <Heading>Дополнительная информация</Heading>
                        </Drawer.Header>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton />
                        </Drawer.CloseTrigger>
                        <Drawer.Body>
                            <HStack
                                separator={<StackSeparator />}
                                align={"start"}
                                h={drawerBodyHeight}
                            >
                                {renderInfoBlock}
                                {renderDesc}
                                {renderCode}
                            </HStack>
                        </Drawer.Body>
                        <Drawer.Footer />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};

const InfoBlock = ({ setting, config, h }) => {
    return (
        <Stack w={"100%"}>
            <Text fontWeight={"medium"}>Настройки</Text>
            <ScrollArea.Root size={"xs"} height={h} variant={"hover"}>
                <ScrollArea.Viewport>
                    <ScrollArea.Content pe={"3"}>
                        <Wrap w={"100%"}>
                            {Object.entries(setting).map(([key, value]) => (
                                <InfoField
                                    key={key}
                                    value={value}
                                    param={key}
                                    config={config}
                                />
                            ))}
                        </Wrap>
                    </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar />
            </ScrollArea.Root>
        </Stack>
    );
};

const InfoField = ({ param, value, config }) => {
    if (
        ["description", "luaExpression", "variableId", "usedIn"].includes(param)
    )
        return null;

    const label = config.settings[param]?.label;
    const resolvedValue = valueResolver(config.settings[param], value);

    return (
        <Stack
            minW={"75px"}
            maxW={"150px"}
            /* borderRadius={"md"}
            border={"1px solid"}
            borderColor={"border"}
            p={"1"} */
        >
            <Text fontWeight={"medium"} truncate title={label}>
                {label}
            </Text>
            <Badge size={"sm"} justifyContent={"center"} variant={"surface"}>
                <Text truncate title={resolvedValue}>
                    {resolvedValue}
                </Text>
            </Badge>
        </Stack>
    );
};

const DescriptionField = ({ setting, config, w, h }) => {
    const label = config.settings["description"]?.label;
    const value = setting["description"];
    return (
        <Stack w={w}>
            <Text fontWeight={"medium"}>{label}</Text>
            <ScrollArea.Root size={"xs"} height={h} variant={"hover"}>
                <ScrollArea.Viewport>
                    <ScrollArea.Content pe={"3"}>{value}</ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar />
            </ScrollArea.Root>
        </Stack>
    );
};

const CodeField = ({ setting, config, w, h }) => {
    const label = config.settings["luaExpression"]?.label;
    const value = setting["luaExpression"];
    return (
        <Stack w={w}>
            <Text fontWeight={"medium"}>{label}</Text>
            <Editor
                defaultLanguage="lua"
                height={h}
                value={value}
                options={{
                    readOnly: true,
                    domReadOnly: true,
                    minimap: { enabled: false },
                    overviewRulerLanes: 0,
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 0,
                    lineNumbers: "off",
                    renderLineHighlight: "none",
                    contextmenu: false,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollbar: {
                        vertical: "hidden",
                        horizontal: "hidden",
                    },
                }}
            />
        </Stack>
    );
};

function valueResolver(context, value) {
    if (!context) return value;
    switch (context.type) {
        case "enum": {
            return context.enumValues.find(value).label;
        }
        case "boolean":
            return value ? "Да" : "Нет";
        default:
            return value;
    }
}
