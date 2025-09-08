import {
    Button,
    CloseButton,
    createOverlay,
    Dialog,
    Icon,
    Portal,
    Stack,
} from "@chakra-ui/react";
import { AttributeChooser } from "./Attributes/AttributeChooser";
import { useQuery } from "@tanstack/react-query";
import { QK } from "@/api/queryKeys";
import { getConfiguration } from "@/api/configuration";
import { configuratorConfig } from "@/utils/configurationParser";
import { VariableValueInput } from "./VariableValueInput";
import { VariableValueSwitch } from "./VariableValueSwitch";

export const dialog = createOverlay((props) => {
    const { title, icon, nodeId, mode, ...rest } = props;
    const { data: path } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => state.settings[nodeId]?.path,
    });
    const { data: variableType } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => state.settings[nodeId]?.setting?.type,
    });

    const nodeCfg = path ? configuratorConfig.nodePaths?.[path] : undefined;
    const dataTypeItems = nodeCfg?.settings?.type?.enumValues;
    const dataType = dataTypeItems.find(variableType);

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
