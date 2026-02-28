import { Box, IconButton, Menu, Portal } from "@chakra-ui/react";
import { LuChevronRight, LuMenu } from "react-icons/lu";
import { useActionsStore } from "../store/actions-store";
import { DownloadProject } from "../ProjectOps";
import { EDIT_GRID_DIALOG_ID, editGridDialog } from "../editGridDialog";
import { OPEN_PROJECT_DIALOG_ID, openProjectDialog } from "../ProjectManager";
import { HOTKEYS, LOCALE } from "../constants";
import { toggleViewOnlyModeAction } from "../actions/toggleViewOnlyModeAction";
import { useImportToServerAction } from "../hooks/useImportToServerAction";

export const EditorMenu = ({ tools }) => {
    const debugMode = useActionsStore((state) => state.debugMode);
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const showGrid = useActionsStore((state) => state.showGrid);
    const showRulers = useActionsStore((state) => state.showRulers);
    const snapToGrid = useActionsStore((state) => state.snapToGrid);
    const showHitRegions = useActionsStore((state) => state.showHitRegions);
    const showStartCoordMarker = useActionsStore(
        (state) => state.showStartCoordMarker,
    );
    const importToServer = useImportToServerAction();

    const menuConfig = [
        {
            label: LOCALE.project,
            value: "project",
            type: "group",
            children: [
                {
                    label: `${LOCALE.projectManager}...`,
                    value: "project-manager",
                    type: "command",
                    command: () =>
                        openProjectDialog.open(OPEN_PROJECT_DIALOG_ID, {
                            tools,
                        }),
                    hotkey: HOTKEYS.openProject.keyLabel,
                },
                {
                    label: LOCALE.importToServer,
                    value: "import-to-server",
                    type: "command",
                    command: () => {
                        importToServer(tools);
                    },
                    hotkey: HOTKEYS.importToServer.keyLabel,
                },
                {
                    label: `${LOCALE.download}...`,
                    value: "download",
                    type: "wrapper",
                    wrapper: DownloadProject,
                    wrapperProps: { tools },
                },
            ],
        },
        {
            label: LOCALE.view,
            value: "view-options",
            type: "group",
            children: [
                {
                    label: LOCALE.snapToGrid,
                    value: "snap-to-grid",
                    type: "checkbox",
                    isChecked: snapToGrid,
                    command: () =>
                        useActionsStore.getState().setSnapToGrid(!snapToGrid),
                },
                {
                    label: LOCALE.toggleGrid,
                    value: "show-grid",
                    type: "checkbox",
                    isChecked: showGrid,
                    command: () =>
                        useActionsStore.getState().setShowGrid(!showGrid),
                    hotkey: HOTKEYS.toggleGrid.keyLabel,
                },
                {
                    label: LOCALE.toggleRulers,
                    value: "show-rulers",
                    type: "checkbox",
                    isChecked: useActionsStore.getState().showRulers,
                    command: () =>
                        useActionsStore.getState().setShowRulers(!showRulers),
                    hotkey: HOTKEYS.toggleRulers.keyLabel,
                },
                {
                    label: LOCALE.showStartCoordMarker,
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
            label: LOCALE.editor,
            value: "editor",
            type: "group",
            children: [
                {
                    label: LOCALE.debugMode,
                    value: "debug-mode",
                    type: "checkbox",
                    isChecked: debugMode,
                    command: () =>
                        useActionsStore.getState().setDebugMode(!debugMode),
                },
                {
                    label: LOCALE.toggleViewOnly,
                    value: "view-only-mode",
                    type: "checkbox",
                    isChecked: viewOnlyMode,
                    command: () => toggleViewOnlyModeAction(tools),
                    hotkey: HOTKEYS.toggleViewOnly.keyLabel,
                },
                { type: "divider" },
                {
                    label: `${LOCALE.gridEditor}...`,
                    value: "edit-grid",
                    type: "command",
                    command: () => editGridDialog.open(EDIT_GRID_DIALOG_ID),
                    hotkey: HOTKEYS.openGridDialog.keyLabel,
                },
            ],
        },
    ];

    if (debugMode) {
        menuConfig[1].children.push({
            label: LOCALE.showHitRegions,
            value: "show-hit-regions",
            type: "checkbox",
            isChecked: showHitRegions,
            command: () =>
                useActionsStore.getState().setShowHitRegions(!showHitRegions),
        });
    }

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
