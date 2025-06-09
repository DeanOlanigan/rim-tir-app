import { Tooltip } from "@/components/ui/tooltip";
import { CONSTANT_VALUES } from "@/config/constants";
import { IconButton, Portal, Menu } from "@chakra-ui/react";
import { useId } from "react";
import { LuPlus, LuAnchor, LuUnplug, LuCable } from "react-icons/lu";

export const ConnectionsButtons = ({ treeApi }) => {
    const handleCreateComport = () => {
        treeApi?.create({
            parentId: null,
            type: {
                nodeType: CONSTANT_VALUES.INTERFACES.comport,
                times: 1,
            },
        });
    };

    const handleCreateIec104 = () => {
        treeApi?.create({
            parentId: null,
            type: {
                nodeType: CONSTANT_VALUES.PROTOCOLS.iec104,
                times: 1,
            },
        });
    };

    const handleCreateGpio = () => {
        treeApi?.create({
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
                    <IconButton
                        size={"2xs"}
                        variant={"subtle"}
                        onClick={(e) => e.stopPropagation()}
                    >
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
