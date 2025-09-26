import { memo } from "react";
import {
    Text,
    IconButton,
    HStack,
    Code,
    Menu,
    Portal,
    Icon,
} from "@chakra-ui/react";
import { NODE_TYPES } from "@/config/constants";
import { NodeValues } from "./NodeValues";
import {
    LuArrowBigRight,
    LuCircle,
    LuPencil,
    LuTextCursorInput,
} from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { QK } from "@/api/queryKeys";
import { getConfiguration } from "@/api/configuration";
import { AdditionalInfoDrawer } from "@/pages/MonitoringPage/AdditionalInfo/Drawer/AdditionalInfoDrawer";
import { dialog } from "@/pages/MonitoringPage/setValue/dialog";
import { TbHandStop } from "react-icons/tb";
import { attributes } from "@/pages/MonitoringPage/setValue/Attributes/attributes";

export const NodeContent = memo(function NodeContent({ id, type, name }) {
    const isFolder = type === NODE_TYPES.folder;
    const isVariable = type === NODE_TYPES.variable;
    const isDataObject = type === NODE_TYPES.dataObject;

    return (
        <HStack justifyContent={"space-between"} w={"100%"}>
            <HStack>
                {isDataObject ? (
                    <BindedVariable id={id} />
                ) : (
                    <Text truncate>{name}</Text>
                )}
                {!isFolder && <AdditionalInfoDrawer id={id} />}
                {(isDataObject || isVariable) && <NodeValues id={id} />}
                {isVariable && <VariableEditMenu id={id} />}
                {(isDataObject || isVariable) && <NodeAttributes id={id} />}
            </HStack>
        </HStack>
    );
});

const BindedVariable = memo(function BindedVariable({ id }) {
    const { data: name } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) =>
            state.settings[state.settings[id]?.setting?.variableId]?.name,
    });

    return (
        <Code variant={"subtle"} colorPalette={"blue"}>
            {name ? name : "Нет переменной"}
        </Code>
    );
});

const VariableEditMenu = memo(function VariableEditMenu({ id }) {
    return (
        <Menu.Root size={"sm"}>
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

const NodeAttributes = memo(function NodeAttributes({ id }) {
    const { data: params } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => state.settings[id]?.mqttPacket?.q?.attrs,
    });
    return (
        <>
            {attributes.map(
                (attr) =>
                    attr?.icon?.as &&
                    params?.includes(attr.name) && (
                        <Icon
                            key={attr.name}
                            size={"md"}
                            {...attr.icon}
                            aria-hidden
                            title={attr.label}
                        />
                    )
            )}
            <Icon
                as={LuCircle}
                fill={params?.includes("used") ? "fg.success" : "fg.error"}
            />
        </>
    );
});

const NodeArrow = ({ type }) => {
    return (
        (type === NODE_TYPES.variable || type === NODE_TYPES.dataObject) && (
            <Icon color={"red.500"} fill={"red.500"} as={LuArrowBigRight} />
        )
    );
};
