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
import { LuInfo } from "react-icons/lu";
import { CodeField } from "./CodeField";
import { DescriptionField } from "./DescriptionField";
import { InfoBlock } from "./InfoBlock";
import { memo } from "react";
import { useSettingsFromCache } from "../../useSettingsFromCache";

export const AdditionalInfoDrawer = memo(function AdditionalInfoDrawer({ id }) {
    const settings = useSettingsFromCache();
    const setting = settings[id]?.setting;
    const path = settings[id]?.path;

    if (!setting) return null;
    const config = path ? configuratorConfig.nodePaths[path] : undefined;

    const setdesc = setting.description;
    const confdesc = config?.settings?.description;
    const setlua = setting.luaExpression;
    const conflua = config?.settings?.luaExpression;

    const drawerBodyHeight = "12rem";
    const blockHeight = "10rem";

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
                                h={drawerBodyHeight}
                            >
                                <InfoBlock
                                    setting={setting}
                                    config={config}
                                    h={blockHeight}
                                />
                                {setdesc && confdesc && (
                                    <DescriptionField
                                        setting={setting}
                                        config={config}
                                        w={"100%"}
                                        h={blockHeight}
                                    />
                                )}
                                {setlua && conflua && (
                                    <CodeField
                                        setting={setting}
                                        config={config}
                                        w={"100%"}
                                        h={blockHeight}
                                    />
                                )}
                            </HStack>
                        </Drawer.Body>
                        <Drawer.Footer />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
});
