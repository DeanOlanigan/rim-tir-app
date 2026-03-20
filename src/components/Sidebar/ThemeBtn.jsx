import { ColorModeIcon, useColorMode } from "../ui/color-mode";
import { SidebarAction } from "./SidebarButton";
import { SidebarTooltip } from "./SidebarTooltip";

export const ThemeBtn = ({ collapsed }) => {
    const { toggleColorMode } = useColorMode();

    return (
        <SidebarTooltip collapsed={collapsed} content={"Сменить тему"}>
            <SidebarAction
                icon={ColorModeIcon}
                label={"Сменить тему"}
                isActive={false}
                collapsed={collapsed}
                onClick={toggleColorMode}
            />
        </SidebarTooltip>
    );
};
