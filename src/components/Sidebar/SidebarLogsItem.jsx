import { LuScrollText } from "react-icons/lu";
import { CanAccess } from "@/CanAccess";
import { SidebarNavItem } from "./SidebarNavItem";

export const SidebarLogsItem = ({ collapsed }) => (
    <CanAccess right={"logs.view"}>
        <SidebarNavItem
            to={"log"}
            icon={LuScrollText}
            label={"Логирование"}
            collapsed={collapsed}
        />
    </CanAccess>
);
