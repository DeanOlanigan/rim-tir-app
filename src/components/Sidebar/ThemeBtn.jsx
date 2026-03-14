import { ColorModeIcon, useColorMode } from "../ui/color-mode";
import { Tooltip } from "../ui/tooltip";
import { SidebarAction } from "./SidebarButton";

export const ThemeBtn = ({ collapsed }) => {
    const { toggleColorMode } = useColorMode();

    return (
        <Tooltip
            showArrow
            content="Сменить тему"
            positioning={{ placement: "right" }}
            openDelay={150}
            disabled={!collapsed}
        >
            <SidebarAction
                icon={ColorModeIcon}
                label={"Сменить тему"}
                isActive={false}
                collapsed={collapsed}
                onClick={toggleColorMode}
            />
        </Tooltip>
    );
};
