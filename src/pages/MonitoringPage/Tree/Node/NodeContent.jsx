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
    return (
        <HStack justifyContent={"space-between"} w={"100%"}>
            <HStack>
                {type === NODE_TYPES.dataObject ? (
                    <BindedVariable id={id} />
                ) : (
                    <Text truncate>{name}</Text>
                )}
                {type !== NODE_TYPES.folder && (
                    <AdditionalInfoDrawer id={id} height={"10rem"} />
                )}
                <NodeArrow type={type} />
            </HStack>
            <HStack>
                {(type === NODE_TYPES.dataObject ||
                    type === NODE_TYPES.variable) && (
                    <>
                        <NodeAttributes id={id} />
                        <NodeValues id={id} />
                    </>
                )}
                {type === NODE_TYPES.variable && <VariableEditMenu id={id} />}
            </HStack>
        </HStack>
    );
});

const BindedVariable = ({ id }) => {
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
};

const VariableEditMenu = ({ id }) => {
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
};

const NodeAttributes = ({ id }) => {
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
};

const NodeArrow = ({ type }) => {
    return (
        (type === NODE_TYPES.variable || type === NODE_TYPES.dataObject) && (
            <Icon color={"red.500"} fill={"red.500"} as={LuArrowBigRight} />
        )
    );
};
