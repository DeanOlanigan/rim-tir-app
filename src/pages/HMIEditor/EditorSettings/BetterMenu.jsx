import { Box, Icon, IconButton, Menu, Portal } from "@chakra-ui/react";
import {
    LuCheck,
    LuChevronRight,
    LuEye,
    LuFile,
    LuFolder,
    LuMenu,
    LuSave,
    LuSettings,
} from "react-icons/lu";

const menuConfig = [
    {
        label: "Project",
        value: "project",
        type: "group",
        icon: <LuFile />,
        children: [
            {
                label: "New...",
                value: "new",
                type: "command",
                command: () => console.log("New"),
            },
            {
                label: "Open...",
                value: "open",
                type: "command",
                icon: <LuFolder />,
                command: () => console.log("Open"),
            },
            {
                label: "Close...",
                value: "close",
                type: "command",
                icon: <LuFolder />,
                command: () => console.log("Close"),
            },
            {
                label: "Download...",
                value: "download",
                type: "command",
                icon: <LuSave />,
                command: () => console.log("Download"),
            },
        ],
    },
    {
        label: "View",
        value: "view-options",
        type: "group",
        icon: <LuEye />,
        children: [
            {
                label: "Snap to Grid",
                value: "snap-to-grid",
                type: "toggle",
                isChecked: false,
                command: () => console.log("Toggle Snap"),
            },
            {
                label: "Show Grid",
                value: "show-grid",
                type: "toggle",
                isChecked: true,
                command: () => console.log("Toggle Grid"),
            },
            {
                label: "Show Hit Regions",
                value: "show-hit-regions",
                type: "toggle",
                isChecked: false,
                command: () => console.log("Toggle Hits"),
            },
            {
                label: "Show Start Coord Marker",
                value: "show-start-coord-marker",
                type: "toggle",
                isChecked: true,
                command: () => console.log("Toggle Start Coord Marker"),
            },
        ],
    },
    {
        label: "Editor",
        value: "editor",
        type: "group",
        icon: <LuSettings />,
        children: [
            {
                label: "Debug Mode",
                value: "debug-mode",
                type: "toggle",
                isChecked: true,
                command: () => console.log("Toggle Debug"),
            },
            {
                label: "View Only Mode",
                value: "view-only-mode",
                type: "toggle",
                isChecked: false,
                command: () => console.log("Toggle ViewOnly"),
            },
            {
                label: "Edit Grid...",
                value: "edit-grid",
                type: "modal",
                command: () => console.log("Edit Grid"),
            },
        ],
    },
];

export const BetterMenu = () => {
    return (
        <Menu.Root size={"sm"}>
            <Menu.Trigger asChild>
                <IconButton size={"xs"} variant={"ghost"}>
                    <LuMenu />
                </IconButton>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        {menuConfig.map((item, index) => (
                            <MenuItem key={index} item={item} />
                        ))}
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

const MenuItem = ({ item }) => {
    if (item.type === "divider") {
        return <Menu.Separator />;
    }

    if (item.children && item.children.length > 0) {
        return (
            <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
                <Menu.TriggerItem>
                    <Box flex={1}>{item.label}</Box>
                    <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            {item.children.map((child, index) => (
                                <MenuItem key={index} item={child} />
                            ))}
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        );
    }

    return (
        <Menu.Item value={item.value} icon={item.icon} onClick={item.command}>
            {item.label}
            {item.isChecked && (
                <Icon as={LuCheck} boxSize={3} ml={2} color="purple.500" />
            )}
        </Menu.Item>
    );
};
