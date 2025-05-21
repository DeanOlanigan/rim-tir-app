import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
    MenuSeparator,
} from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import { IconButton, Icon } from "@chakra-ui/react";
import { menuConfigConnections } from "@/config/contextMenu";
import { useId } from "react";
import { LuPackagePlus } from "react-icons/lu";

export const CreateDataObjectMenu = (variableTreeRef) => {
    const id = useId();

    return (
        <MenuRoot ids={{ trigger: id }}>
            <Tooltip
                ids={{ trigger: id }}
                content={"Создать информационный объект..."}
                positioning={{ placement: "top" }}
            >
                <MenuTrigger asChild>
                    <IconButton size={"2xs"} variant={"subtle"}>
                        <Icon size={"sm"}>
                            <LuPackagePlus />
                        </Icon>
                    </IconButton>
                </MenuTrigger>
            </Tooltip>
            <MenuContent>
                {menuConfigConnections["default"].map((item, index) => {
                    if (item.type === "separator") {
                        return <MenuSeparator key={`sep_${index}`} />;
                    }
                    return (
                        <MenuItem
                            key={item.key}
                            value={item.key}
                            {...item.style}
                            onClick={() =>
                                item.action?.(variableTreeRef?.current)
                            }
                        >
                            {item.icon?.()}
                            {item.label}
                        </MenuItem>
                    );
                })}
            </MenuContent>
        </MenuRoot>
    );
};
