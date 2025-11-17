import { useEffect, useRef } from "react";
import { useNodeStore } from "../../store/node-store";
import { useActionsStore } from "../../store/actions-store";
import { createToolManager } from "../tools/manager";
import { createHandTool } from "../tools/hand";
import { createSelectTool } from "../tools/select";
import { createDrawRectTool } from "../tools/drawRect";
import { createDrawEllipseTool } from "../tools/drawEllipse";
import { createDrawLineTool } from "../tools/drawLine";
import { createDrawArrowTool } from "../tools/drawArrow";

export function useToolsManager(
    stageRef,
    selectionBoxRef,
    transformerRef,
    layerRef
) {
    const managerRef = useRef(null);
    const currentAction = useActionsStore((state) => state.currentAction);

    if (!managerRef.current) {
        const selectedIds = () => useNodeStore.getState().selectedIds;
        const setSelectedIds = (ids) =>
            useNodeStore.getState().setSelectedIds(ids);
        const addNode = (id, patch) =>
            useNodeStore.getState().addNode(id, patch);
        const getGrid = () => {
            const { gridSize, snapToGrid } = useActionsStore.getState();
            return { gridSize, snapToGrid };
        };
        const getWorkSize = () => {
            const size = useActionsStore.getState().size;
            return { workW: size.width, workH: size.height };
        };
        const api = {
            stageRef,
            selectionBoxRef,
            transformerRef,
            layerRef,
            addNode,
            selectedIds,
            setSelectedIds,
            getGrid,
            getWorkSize,
        };

        const toolsMap = {
            select: createSelectTool({ ...api }),
            hand: createHandTool({ stageRef }),
            square: createDrawRectTool({ ...api }),
            ellipse: createDrawEllipseTool({ ...api }),
            line: createDrawLineTool({ ...api }),
            arrow: createDrawArrowTool({ ...api }),
        };

        managerRef.current = createToolManager({ stageRef, toolsMap, api });
    }

    const manager = managerRef.current;

    useEffect(() => {
        if (!manager) return;
        manager.setActive(currentAction);
    }, [manager, currentAction]);

    return manager;
}
