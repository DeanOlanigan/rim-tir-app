import { HStack, Text, IconButton, Icon, Menu, Portal } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import {
    LuFolderPlus,
    LuCopyMinus,
    LuFilePlus,
    LuBan,
    LuPlus,
    LuPiggyBank,
    LuHam,
} from "react-icons/lu";
import { CONSTANT_VALUES } from "@/config/constants";
import { locale } from "@/config/locale";
import { useLocaleStore } from "@/store/locale-store";
import { useVariablesStore } from "@/store/variables-store";
import { LuAnchor, LuUnplug, LuCable } from "react-icons/lu";
import { useId, useState } from "react";

export const TreeCardTitle = ({ type, variableTreeRef }) => {
    const lang = useLocaleStore((state) => state.locale);
    return (
        <HStack justify={"space-between"}>
            <Text>{locale[lang][type] || type}</Text>
            <TitleButtons type={type} variableTreeRef={variableTreeRef} />
        </HStack>
    );
};

const TitleButtons = ({ type, variableTreeRef }) => {
    return (
        <HStack
            gap={"1"}
            opacity={"0"}
            transition={"opacity 0.2s ease-in-out"}
            _groupHover={{ opacity: 1 }}
        >
            {(type === CONSTANT_VALUES.TREE_TYPES.send ||
                type === CONSTANT_VALUES.TREE_TYPES.receive) && (
                <ConnectionsTitleButtons variableTreeRef={variableTreeRef} />
            )}
            {type === CONSTANT_VALUES.TREE_TYPES.variables && (
                <VariablesTitleButtons variableTreeRef={variableTreeRef} />
            )}
            <SetIgnoreBtn variableTreeRef={variableTreeRef} />
            <Tooltip content={"Свернуть узлы"}>
                <IconButton
                    size={"2xs"}
                    variant={"subtle"}
                    onClick={() => {
                        variableTreeRef?.current.closeAll();
                    }}
                >
                    <Icon
                        size={"sm"}
                        transform={"scaleX(-1)"}
                        as={LuCopyMinus}
                    />
                </IconButton>
            </Tooltip>
        </HStack>
    );
};

const VariablesTitleButtons = ({ variableTreeRef }) => {
    const lang = useLocaleStore((state) => state.locale);
    return (
        <>
            <Tooltip content={locale[lang].createVariable}>
                <IconButton
                    size={"2xs"}
                    variant={"subtle"}
                    onClick={() => {
                        variableTreeRef?.current.create({
                            parentId: null,
                            type: {
                                nodeType: CONSTANT_VALUES.NODE_TYPES.variable,
                                times: 1,
                            },
                        });
                    }}
                >
                    <LuFilePlus />
                </IconButton>
            </Tooltip>
            <Tooltip content={locale[lang].createFolder}>
                <IconButton
                    size={"2xs"}
                    variant={"subtle"}
                    onClick={() => {
                        variableTreeRef?.current.create({
                            parentId: null,
                            type: {
                                nodeType: CONSTANT_VALUES.NODE_TYPES.folder,
                                times: 1,
                            },
                        });
                    }}
                >
                    <LuFolderPlus />
                </IconButton>
            </Tooltip>
        </>
    );
};

const ConnectionsTitleButtons = ({ variableTreeRef }) => {
    const handleCreateComport = () => {
        variableTreeRef?.current.create({
            parentId: null,
            type: {
                nodeType: CONSTANT_VALUES.INTERFACES.comport,
                times: 1,
            },
        });
    };

    const handleCreateIec104 = () => {
        variableTreeRef?.current.create({
            parentId: null,
            type: {
                nodeType: CONSTANT_VALUES.PROTOCOLS.iec104,
                times: 1,
            },
        });
    };

    const handleCreateGpio = () => {
        variableTreeRef?.current.create({
            parentId: null,
            type: {
                nodeType: CONSTANT_VALUES.INTERFACES.gpio,
                times: 1,
            },
        });
    };
    const triggerId = useId();
    return (
        <Menu.Root ids={{ trigger: triggerId }}>
            <Tooltip
                content={"Создать соединение"}
                ids={{ trigger: triggerId }}
            >
                <Menu.Trigger asChild>
                    <IconButton size={"2xs"} variant={"subtle"}>
                        <LuPlus />
                    </IconButton>
                </Menu.Trigger>
            </Tooltip>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item
                            value="comport"
                            onClick={handleCreateComport}
                        >
                            <LuAnchor />
                            Создать Последовательный порт...
                        </Menu.Item>
                        <Menu.Item value="iec104" onClick={handleCreateIec104}>
                            <LuUnplug />
                            Создать IEC104...
                        </Menu.Item>
                        <Menu.Item value="gpio" onClick={handleCreateGpio}>
                            <LuCable />
                            Создать GPIO...
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

const SetIgnoreBtn = ({ variableTreeRef }) => {
    const toggleIgnoreNode = useVariablesStore((state) => state.ignoreNode);
    const [ignoreMode, setIgnoreMode] = useState(false);
    return (
        <Tooltip
            content={
                ignoreMode
                    ? "Разблокировать корневые узлы"
                    : "Заблокировать корневые узлы"
            }
        >
            <IconButton
                size={"2xs"}
                variant={"subtle"}
                onClick={() => {
                    const ids = variableTreeRef?.current.root.children.map(
                        (child) => child.id
                    );
                    /* const ignore =
                        !variableTreeRef?.current.root.children[0].data
                            .isIgnored; */
                    toggleIgnoreNode(
                        variableTreeRef?.current,
                        ids,
                        !ignoreMode
                    );
                    setIgnoreMode(!ignoreMode);
                }}
            >
                {ignoreMode ? (
                    <Icon as={LuHam} color={"red.400"} fill={"red.800"} />
                ) : (
                    <Icon as={LuPiggyBank} color={"red.400"} />
                )}
            </IconButton>
        </Tooltip>
    );
};
