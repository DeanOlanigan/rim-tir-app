import { Tooltip } from "@/components/ui/tooltip";
import { configuratorConfig } from "@/utils/configurationParser";
import { IconButton, Menu } from "@chakra-ui/react";
import { useId } from "react";
import { LuPlus } from "react-icons/lu";
import { MenuItem } from "../../../ContextMenu/MenuItem";

export const ConnectionsButtons = ({ treeApi, type }) => {
    const triggerId = useId();

    const contextMenu = configuratorConfig.contextMenu[type]["#"];
    return (
        <Menu.Root
            ids={{ trigger: triggerId }}
            lazyMount
            unmountOnExit
            size={"sm"}
        >
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
            <Menu.Positioner>
                <Menu.Content>
                    {contextMenu.map((item, index) => (
                        <MenuItem
                            key={index}
                            item={item}
                            index={index}
                            apiPath={treeApi}
                            updateContext={null}
                        />
                    ))}
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    );
};
