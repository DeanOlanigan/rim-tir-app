import { NavLink } from "react-router-dom";
import { SidebarAction } from "./SidebarButton";
import { SidebarTooltip } from "./SidebarTooltip";

export const SidebarNavItem = ({ to, icon, label, collapsed, onClick }) => {
    return (
        <NavLink
            to={to}
            tabIndex={-1}
            style={!collapsed ? { width: "100%" } : {}}
        >
            {({ isActive, isPending }) => (
                <SidebarTooltip collapsed={collapsed} content={label}>
                    <SidebarAction
                        icon={icon}
                        label={label}
                        isActive={isActive}
                        isPending={isPending}
                        collapsed={collapsed}
                        onClick={onClick}
                    />
                </SidebarTooltip>
            )}
        </NavLink>
    );
};
