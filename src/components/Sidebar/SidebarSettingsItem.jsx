import { LuSettings } from "react-icons/lu";
import { CanAccess } from "@/CanAccess";
import { SidebarNavItem } from "./SidebarNavItem";

export const SidebarSettingsItem = ({ collapsed }) => (
    <CanAccess right={"settings.view"}>
        <SidebarNavItem
            to={"settings"}
            icon={LuSettings}
            label={"Настройки"}
            collapsed={collapsed}
        />
    </CanAccess>
);
