import { useActionsStore } from "../../store/actions-store";
import { useActionsRunner } from "./useActionsRunner";

export const useHandlers = (node) => {
    const { runActions } = useActionsRunner();
    if (!node) return;

    const handleClick = (e) => {
        if (e.evt.button !== 0) return;
        const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
        if (!viewOnlyMode) return;
        console.log("NODE CLICK");
        if (node.events?.onClick?.length > 0) {
            e.cancelBubble = true;
            console.log("Running action for node:", node.id);
            runActions(node.events.onClick);
        }
    };

    const handleDoubleClick = (e) => {
        if (e.evt.button !== 0) return;
        const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
        if (!viewOnlyMode) return;
        console.log("NODE DOUBLE CLICK");
        if (node.events?.onDoubleClick?.length > 0) {
            e.cancelBubble = true;
            console.log("Running action for node:", node.id);
            runActions(node.events.onDoubleClick);
        }
    };

    const handleContextMenu = (e) => {
        const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
        if (!viewOnlyMode) return;
        console.log("NODE CONTEXT MENU");
        e.cancelBubble = true;
        if (node.events?.onContextMenu?.length > 0) {
            console.log("Running action for node:", node.id);
            runActions(node.events.onContextMenu);
        }
    };

    const handePointerDown = (e) => {
        const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
        if (!viewOnlyMode) return;
        console.log("NODE POINTER DOWN");
        if (node.events?.onMouseDown?.length > 0) {
            e.cancelBubble = true;
            console.log("Running action for node:", node.id);
            runActions(node.events.onMouseDown);
        }
    };

    const handePointerUp = (e) => {
        const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
        if (!viewOnlyMode) return;
        console.log("NODE POINTER UP");
        if (node.events?.onMouseUp?.length > 0) {
            e.cancelBubble = true;
            console.log("Running action for node:", node.id);
            runActions(node.events.onMouseUp);
        }
    };

    return {
        onClick: handleClick,
        onDblClick: handleDoubleClick,
        onContextMenu: handleContextMenu,
        onPointerDown: handePointerDown,
        onPointerUp: handePointerUp,
    };
};
