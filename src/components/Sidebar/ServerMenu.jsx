import { CanAccess } from "@/CanAccess";
import { useStartTirMutation, useStopTirMutation } from "@/hooks/useMutation";
import { Menu, Portal } from "@chakra-ui/react";
import { LuServerCog } from "react-icons/lu";
import { SidebarAction } from "./SidebarButton";
import { useId } from "react";
import { SidebarTooltip } from "./SidebarTooltip";

export const ServerMenu = ({ collapsed }) => {
    const startM = useStartTirMutation();
    const stopM = useStopTirMutation();
    const triggerId = useId();
    return (
        <Menu.Root
            lazyMount
            unmountOnExit
            positioning={{ placement: "right-end" }}
            ids={{ trigger: triggerId }}
            size={"sm"}
        >
            <SidebarTooltip
                content={"Сервер"}
                collapsed={collapsed}
                id={triggerId}
            >
                <Menu.Trigger asChild>
                    <SidebarAction
                        icon={LuServerCog}
                        label={"Сервер"}
                        isActive={false}
                        collapsed={collapsed}
                    />
                </Menu.Trigger>
            </SidebarTooltip>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <CanAccess right={"server.start"}>
                            <Menu.Item
                                value="start"
                                onClick={() => startM.mutate()}
                                disabled={startM.isPending}
                            >
                                {startM.isPending
                                    ? "Запуск..."
                                    : "Запустить сервер"}
                            </Menu.Item>
                        </CanAccess>
                        <CanAccess right={"server.stop"}>
                            <Menu.Item
                                value="stop"
                                onClick={() => stopM.mutate()}
                                disabled={stopM.isPending}
                            >
                                {stopM.isPending
                                    ? "Остановка..."
                                    : "Остановить сервер"}
                            </Menu.Item>
                        </CanAccess>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
