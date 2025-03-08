import {
    Card,
    Stack,
    StackSeparator,
    Text,
    Flex,
    Box,
    Button,
} from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { EditorWrapper } from "./Editor/EditorWrapper";
import { useVariablesStore } from "../../store/variables-store";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../components/ui/menu";
import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
} from "../../components/ui/popover";

export const EditorCard = () => {
    const configInfo = useVariablesStore((state) => state.configInfo);
    const settings = useVariablesStore(
        (state) => state.settings[configInfo.id]
    );

    return (
        <Flex w={"100%"} h={"100%"} direction={"column"} gap={"1"}>
            <Card.Root>
                <Card.Body p={"2"}>
                    <Card.Title>
                        <Stack
                            direction={"row"}
                            gap={"2"}
                            justify={"space-between"}
                            align={"center"}
                        >
                            <Stack direction={"row"} gap={"0"}>
                                <MenuRoot size={"md"}>
                                    <MenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="2xs"
                                            rounded={"md"}
                                        >
                                            Конфигурация
                                        </Button>
                                    </MenuTrigger>
                                    <MenuContent>
                                        <MenuItem value="new-file">
                                            Создать...
                                        </MenuItem>
                                        <MenuItem value="new-txt">
                                            Открыть...
                                        </MenuItem>
                                        <MenuItem value="new-win">
                                            Сохранить
                                        </MenuItem>
                                        <MenuItem value="open-file">
                                            Сохранить как...
                                        </MenuItem>
                                        <MenuItem value="export">
                                            Закрыть
                                        </MenuItem>
                                    </MenuContent>
                                </MenuRoot>
                                <MenuRoot size={"md"}>
                                    <MenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="2xs"
                                            rounded={"md"}
                                        >
                                            Роутер
                                        </Button>
                                    </MenuTrigger>
                                    <MenuContent>
                                        <MenuItem value="new-txt">
                                            Отправить конфигурацию
                                        </MenuItem>
                                        <MenuItem value="new-file">
                                            Обновить конфигурацию
                                        </MenuItem>
                                    </MenuContent>
                                </MenuRoot>
                            </Stack>
                            <PopoverRoot>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="subtle"
                                        size="2xs"
                                        rounded={"md"}
                                        py={"0"}
                                    >
                                        <Text
                                            fontSize={"sm"}
                                            fontWeight={"bold"}
                                        >
                                            {settings?.name}
                                        </Text>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverBody>
                                        <Text fontSize={"sm"}>
                                            {settings?.name}
                                        </Text>
                                        <Text>
                                            {settings?.setting.description}
                                        </Text>
                                        <Text fontSize={"sm"}>
                                            {settings?.setting.date}
                                        </Text>
                                        <Text fontSize={"sm"}>
                                            {settings?.setting.version}
                                        </Text>
                                    </PopoverBody>
                                </PopoverContent>
                            </PopoverRoot>
                            <Stack
                                direction={"row"}
                                gap={"2"}
                                separator={<StackSeparator />}
                            >
                                <Text fontSize={"sm"}>
                                    {settings?.setting.date}
                                </Text>
                                <Text fontSize={"sm"}>
                                    {settings?.setting.version}
                                </Text>
                            </Stack>
                        </Stack>
                    </Card.Title>
                </Card.Body>
            </Card.Root>
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
        </Flex>
    );
};
