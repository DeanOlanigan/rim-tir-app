import { CanAccess } from "@/CanAccess";
import { ServerMenu } from "./ServerMenu";

export const SidebarServerItem = ({ collapsed }) => (
    <CanAccess anyOf={["server.start", "server.stop"]}>
        <ServerMenu collapsed={collapsed} />
    </CanAccess>
);
