import { useCallback, useRef } from "react";
import { useActionsStore } from "../../store/actions-store";
import { useNodeStore } from "../../store/node-store";
import { useActionsRunner } from "./useActionsRunner";

export const useHandlers = (node) => {
    const { runActions } = useActionsRunner();

    const nodeRef = useRef(node);
    nodeRef.current = node;

    const onClick = useCallback(
        (e) => {
            const currentNode = nodeRef.current;
            if (!currentNode) return;

            const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
            if (!viewOnlyMode) return;

            if (e.evt.button !== 0) return;

            if (currentNode.events?.onClick?.length > 0) {
                e.cancelBubble = true;
                console.log("Running click action for node:", currentNode.id);
                runActions(currentNode.events.onClick);
            }
        },
        [runActions],
    );

    const onDblClick = useCallback(
        (e) => {
            const currentNode = nodeRef.current;
            if (!currentNode) return;

            const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
            if (!viewOnlyMode) return;

            if (e.evt.button !== 0) return;

            if (currentNode.events?.onDoubleClick?.length > 0) {
                e.cancelBubble = true;
                console.log("Running dbclick action for node:", currentNode.id);
                runActions(currentNode.events.onDoubleClick);
            }
        },
        [runActions],
    );

    const onContextMenu = useCallback(
        (e) => {
            const currentNode = nodeRef.current;
            if (!currentNode) return;

            const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
            if (!viewOnlyMode) return;

            if (currentNode.events?.onContextMenu?.length > 0) {
                e.cancelBubble = true;
                console.log("Running context action for node:", currentNode.id);
                runActions(currentNode.events.onContextMenu);
            }
        },
        [runActions],
    );

    const onPointerDown = useCallback(
        (e) => {
            const currentNode = nodeRef.current;
            if (!currentNode) return;

            const viewOnlyMode = useActionsStore.getState().viewOnlyMode;

            if (!viewOnlyMode) {
                const isMeta = e.evt.metaKey || e.evt.ctrlKey || e.evt.shiftKey;
                const selectedIds = useNodeStore.getState().selectedIds;
                const isSelected = selectedIds.includes(currentNode.id);

                if (isSelected && !isMeta) {
                    e.cancelBubble = true;
                }
                return;
            }

            if (currentNode.events?.onMouseDown?.length > 0) {
                e.cancelBubble = true;
                console.log(
                    "Running pointer down action for node:",
                    currentNode.id,
                );
                runActions(currentNode.events.onMouseDown);
            }
        },
        [runActions],
    );

    const onPointerUp = useCallback(
        (e) => {
            const currentNode = nodeRef.current;
            if (!currentNode) return;

            const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
            if (!viewOnlyMode) return;

            if (currentNode.events?.onMouseUp?.length > 0) {
                e.cancelBubble = true;
                console.log(
                    "Running  pointer up action for node:",
                    currentNode.id,
                );
                runActions(currentNode.events.onMouseUp);
            }
        },
        [runActions],
    );

    const onMouseEnter = useCallback((e) => {
        const currentNode = nodeRef.current;
        if (!currentNode) return;

        const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
        if (!viewOnlyMode) return;

        const ev = currentNode.events;

        if (
            ev.onClick.length > 0 ||
            ev.onDoubleClick.length > 0 ||
            ev.onContextMenu.length > 0 ||
            ev.onMouseDown.length > 0 ||
            ev.onMouseUp.length > 0
        ) {
            const stage = e.target.getStage();
            stage.container().style.cursor = "pointer";
        }
    }, []);

    const onMouseLeave = useCallback((e) => {
        const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
        if (!viewOnlyMode) return;

        const stage = e.target.getStage();
        stage.container().style.cursor = "default";
    }, []);

    return {
        onClick,
        onDblClick,
        onContextMenu,
        onPointerDown,
        onPointerUp,
        onMouseEnter,
        onMouseLeave,
    };
};
