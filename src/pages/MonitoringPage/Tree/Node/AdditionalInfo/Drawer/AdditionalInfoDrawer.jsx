import { getConfiguration } from "@/api/configuration";
import { QK } from "@/api/queryKeys";
import { configuratorConfig } from "@/utils/configurationParser";
import {
    CloseButton,
    Drawer,
    Heading,
    HStack,
    IconButton,
    Portal,
    StackSeparator,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LuInfo } from "react-icons/lu";
import { CodeField } from "./CodeField";
import { DescriptionField } from "./DescriptionField";
import { InfoBlock } from "./InfoBlock";

export const AdditionalInfoDrawer = ({ id }) => {
    // TODO Решить проблему с перерисовкой
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
                <Drawer.Backdrop />
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
