import { Box, IconButton, Menu, Portal } from "@chakra-ui/react";
import { LuChevronRight, LuMenu } from "react-icons/lu";
import { useNodeStore } from "../store/node-store";
import { useActionsStore } from "../store/actions-store";
import { DownloadProject } from "../ProjectOps";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import { EDIT_GRID_DIALOG_ID, editGridDialog } from "../editGridDialog";
import { OPEN_PROJECT_DIALOG_ID, openProjectDialog } from "../ProjectManager";
import { useSaveProjectMutation } from "../mutations";
import { HOTKEYS } from "../constants";

export const EditorMenu = ({ tools }) => {
    const debugMode = useActionsStore((state) => state.debugMode);
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const showGrid = useActionsStore((state) => state.showGrid);
    const snapToGrid = useActionsStore((state) => state.snapToGrid);
    const showHitRegions = useActionsStore((state) => state.showHitRegions);
    const showStartCoordMarker = useActionsStore(
        (state) => state.showStartCoordMarker,
    );

    const saveMutation = useSaveProjectMutation();

    const menuConfig = [
        {
            label: "Project",
            value: "project",
            type: "group",
            children: [
                {
                    label: "Project manager...",
                    value: "project-manager",
                    type: "command",
                    command: () =>
                        openProjectDialog.open(OPEN_PROJECT_DIALOG_ID, {
                            tools,
                        }),
                    hotkey: HOTKEYS.openProject.keyLabel,
                },
                {
                    label: "Close...",
                    value: "close",
                    type: "command",
                    command: () =>
                        confirmDialog.open(CONFIRM_DIALOG_ID, {
                            onAccept: () => {
                                useNodeStore.getState().close();
                            },
                            title: "Закрыть проект?",
                            message: "Все несохранённые данные будут потеряны.",
                        }),
                },
                {
                    label: "Import to server...",
                    value: "import-to-server",
                    type: "command",
                    command: () => {
                        const state = useNodeStore.getState();
                        const project = {
                            kind: "HMIEditorProject",
                            schemaVersion: 2,
                            projectName: state.projectName,
                            activePageId: state.activePageId,
                            pages: state.pages,
                            nodes: state.nodes,
                        };
                        const filename = state.projectName + ".json";
                        saveMutation.mutate({ filename, project });
                    },
                },
                {
                    label: "Download...",
                    value: "download",
                    type: "wrapper",
                    wrapper: DownloadProject,
                },
            ],
        },
        {
            label: "View",
            value: "view-options",
            type: "group",
            children: [
                {
                    label: "Snap to Grid",
                    value: "snap-to-grid",
                    type: "checkbox",
                    isChecked: snapToGrid,
                    command: () =>
                        useActionsStore.getState().setSnapToGrid(!snapToGrid),
                },
                {
                    label: "Show Grid",
                    value: "show-grid",
                    type: "checkbox",
                    isChecked: showGrid,
                    command: () =>
                        useActionsStore.getState().setShowGrid(!showGrid),
                    hotkey: HOTKEYS.toggleGrid.keyLabel,
                },
                {
                    label: "Show Hit Regions",
                    value: "show-hit-regions",
                    type: "checkbox",
                    isChecked: showHitRegions,
                    command: () =>
                        useActionsStore
                            .getState()
                            .setShowHitRegions(!showHitRegions),
                },
                {
                    label: "Show Start Coord Marker",
                    value: "show-start-coord-marker",
                    type: "checkbox",
                    isChecked: showStartCoordMarker,
                    command: () =>
                        useActionsStore
                            .getState()
                            .setShowStartCoordMarker(!showStartCoordMarker),
                },
            ],
        },
        {
            label: "Editor",
            value: "editor",
            type: "group",
            children: [
                {
                    label: "Debug Mode",
                    value: "debug-mode",
                    type: "checkbox",
                    isChecked: debugMode,
                    command: () =>
                        useActionsStore.getState().setDebugMode(!debugMode),
                },
                {
                    label: "View Only Mode",
                    value: "view-only-mode",
                    type: "checkbox",
                    isChecked: viewOnlyMode,
                    command: () =>
                        useActionsStore
                            .getState()
                            .setViewOnlyMode(!viewOnlyMode),
                    hotkey: HOTKEYS.toggleViewOnly.keyLabel,
                },
                { type: "divider" },
                {
                    label: "Edit Grid...",
                    value: "edit-grid",
                    type: "command",
                    command: () => editGridDialog.open(EDIT_GRID_DIALOG_ID),
                },
            ],
        },
    ];

    return (
        <Menu.Root size={"sm"} unmountOnExit lazyMount>
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
            <Menu.Root
                unmountOnExit
                lazyMount
                size={"sm"}
                positioning={{ placement: "right-start", gutter: 2 }}
            >
                <Menu.TriggerItem ps={8}>
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

    if (item.type === "checkbox") {
        return (
            <Menu.CheckboxItem
                checked={item.isChecked}
                onCheckedChange={item.command}
                value={item.value}
            >
                <Menu.ItemIndicator />
                <Box flex={1}>{item.label}</Box>
                {item.hotkey && (
                    <Menu.ItemCommand size={"sm"}>
                        {item.hotkey}
                    </Menu.ItemCommand>
                )}
            </Menu.CheckboxItem>
        );
    }

    if (item.type === "wrapper") {
        const WrapperComponent = item.wrapper;
        return (
            <WrapperComponent {...(item.wrapperProps || {})}>
                <Menu.Item value={item.value} ps={8}>
                    <Box flex={1}>{item.label}</Box>
                    {item.hotkey && (
                        <Menu.ItemCommand size={"sm"}>
                            {item.hotkey}
                        </Menu.ItemCommand>
                    )}
                </Menu.Item>
            </WrapperComponent>
        );
    }

    if (item.command) {
        return (
            <Menu.Item value={item.value} onClick={item.command} ps={8}>
                <Box flex={1}>{item.label}</Box>
                {item.hotkey && (
                    <Menu.ItemCommand size={"sm"}>
                        {item.hotkey}
                    </Menu.ItemCommand>
                )}
            </Menu.Item>
        );
    }

    return (
        <Menu.Item value={item.value} onClick={item.command} ps={8}>
            <Box flex={1}>{item.label}</Box>
            {item.hotkey && (
                <Menu.ItemCommand size={"sm"}>{item.hotkey}</Menu.ItemCommand>
            )}
        </Menu.Item>
    );
};
