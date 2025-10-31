import {
    Button,
    CloseButton,
    createOverlay,
    Dialog,
    Heading,
    HStack,
    Icon,
    Portal,
    Stack,
    StackSeparator,
} from "@chakra-ui/react";
import { AttributeChooser } from "./Attributes/AttributeChooser";
import { configuratorConfig } from "@/store/configurator-config";
import { VariableValueInput } from "./VariableValueInput";
import { VariableValueSwitch } from "./VariableValueSwitch";
import { useSettingsFromCache } from "../useSettingsFromCache";
import { InfoBlock } from "../AdditionalInfo/Drawer/InfoBlock";
import { DescriptionField } from "../AdditionalInfo/Drawer/DescriptionField";
import { CodeField } from "../AdditionalInfo/Drawer/CodeField";

export const signalEditDialog = createOverlay((props) => {
    const { title, icon, nodeId, mode, ...rest } = props;
    const settings = useSettingsFromCache();
    const path = settings[nodeId]?.path;
    const variableType = settings[nodeId]?.setting?.type;

    const nodeCfg = path ? configuratorConfig.nodePaths?.[path] : undefined;
    const dataTypeItems = nodeCfg?.settings?.type?.enumValues;
    const dataType = dataTypeItems.find((item) => item.value === variableType);

    return (
        <Dialog.Root
            {...rest}
            placement={"center"}
            size={"xl"}
            lazyMount
            unmountOnExit
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header alignItems={"center"}>
                            <Icon size={"xl"} as={icon} />
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size={"sm"} />
                        </Dialog.CloseTrigger>
                        <Dialog.Body asChild>
                            <Stack>
                                <Dialog.Description>
                                    Изменение значения переменной
                                </Dialog.Description>
                                {dataType.value === "bit" ? (
                                    <VariableValueSwitch />
                                ) : (
                                    <VariableValueInput dataType={dataType} />
                                )}
                                <AttributeChooser mode={mode} />
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            {mode === "manual" ? (
                                <>
                                    <Button size={"xs"}>
                                        Ручной ввод - Применить
                                    </Button>
                                    <Button size={"xs"}>
                                        Ручной ввод - Отмена
                                    </Button>
                                </>
                            ) : (
                                <Button size={"xs"}>Применить</Button>
                            )}
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});

export const infoDialog = createOverlay((props) => {
    const { id, ...rest } = props;
    const settings = useSettingsFromCache();

    const setting = settings[id]?.setting;
    const path = settings[id]?.path;

    if (!setting) return null;
    const config = path ? configuratorConfig.nodePaths?.[path] : undefined;

    const setdesc = setting.description;
    const confdesc = config?.settings?.description;
    const setlua = setting.luaExpression;
    const conflua = config?.settings?.luaExpression;

    const drawerBodyHeight = "12rem";
    const blockHeight = "10rem";

    return (
        <Dialog.Root
            {...rest}
            placement={"center"}
            size={"xl"}
            lazyMount
            unmountOnExit
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header alignItems={"center"}>
                            <Heading>Дополнительная информация</Heading>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size={"sm"} />
                        </Dialog.CloseTrigger>
                        <Dialog.Body asChild>
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
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
