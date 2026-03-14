import { Icon, IconButton } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

export const CollapseBtn = ({ collapsed, setCollapsed }) => {
    return (
        <Tooltip
            showArrow
            content={collapsed ? "Развернуть меню" : "Свернуть меню"}
            positioning={{ placement: "right" }}
            openDelay={150}
        >
            <IconButton onClick={setCollapsed} variant="ghost" size="xs">
                <Icon
                    as={collapsed ? LuPanelLeftOpen : LuPanelLeftClose}
                    boxSize="5"
                />
            </IconButton>
        </Tooltip>
    );
};
