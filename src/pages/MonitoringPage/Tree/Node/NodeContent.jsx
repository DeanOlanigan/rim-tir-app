import { memo } from "react";
import { Text, IconButton, HStack, Code, Menu, Portal } from "@chakra-ui/react";
import { NODE_TYPES } from "@/config/constants";
import { LuPencil, LuTextCursorInput } from "react-icons/lu";
import { AdditionalInfoDrawer } from "@/pages/MonitoringPage/AdditionalInfo/Drawer/AdditionalInfoDrawer";
import { dialog } from "@/pages/MonitoringPage/setValue/dialog";
import { TbHandStop } from "react-icons/tb";
import { useSettingsFromCache } from "../../useSettingsFromCache";
import { NodeValues } from "./NodeValues";
import { NodeAttributes } from "./NodeAttributes";
import { useSparklineDataset } from "../../useSparklineDataset";
import { Sparkline } from "./Sparkline";

export const NodeContent = memo(function NodeContent({ id, type, name }) {
    const isFolder = type === NODE_TYPES.folder;
    const isVariable = type === NODE_TYPES.variable;
    const isDataObject = type === NODE_TYPES.dataObject;

    const settings = useSettingsFromCache();
    const isGraph =
        type === NODE_TYPES.variable && settings[id]?.setting?.graph;

    return (
        <HStack justifyContent={"space-between"} w={"100%"}>
            <HStack>
                {isDataObject ? (
                    <BindedVariable id={id} />
                ) : (
                    <Text truncate>{name}</Text>
                )}
                {!isFolder && <AdditionalInfoDrawer id={id} />}
            </HStack>
            <HStack>
                {(isDataObject || isVariable) && <NodeAttributes id={id} />}
                {isGraph && <SparkLineWrapper id={id} />}
                {(isDataObject || isVariable) && <NodeValues id={id} />}
                {isVariable && <VariableEditMenu id={id} />}
            </HStack>
        </HStack>
    );
});

const SparkLineWrapper = memo(function SparkLineWrapper({ id }) {
    const points = useSparklineDataset(id, 24);
    return <Sparkline data={points} />;
});

const BindedVariable = memo(function BindedVariable({ id }) {
    const settings = useSettingsFromCache();
    const name = settings[settings[id]?.setting?.variableId]?.name;

    return (
        <Code variant={"subtle"} colorPalette={"blue"}>
            {name ? name : "Нет переменной"}
        </Code>
    );
});

const VariableEditMenu = memo(function VariableEditMenu({ id }) {
    return (
        <Menu.Root size={"sm"} lazyMount unmountOnExit>
            <Menu.Trigger asChild>
                <IconButton size={"2xs"} variant={"subtle"}>
                    <LuPencil />
                </IconButton>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item
                            value={"manual"}
                            onClick={() => {
                                dialog.open("manual", {
                                    title: "Ручной ввод",
                                    mode: "manual",
                                    icon: TbHandStop,
                                    nodeId: id,
                                });
                            }}
                        >
                            <TbHandStop />
                            Ручной ввод
                        </Menu.Item>
                        <Menu.Item
                            value={"edit"}
                            onClick={() => {
                                dialog.open("edit", {
                                    title: "Редактор сигнала",
                                    mode: "edit",
                                    icon: LuTextCursorInput,
                                    nodeId: id,
                                });
                            }}
                        >
                            <LuTextCursorInput />
                            Редактор сигнала
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
});
