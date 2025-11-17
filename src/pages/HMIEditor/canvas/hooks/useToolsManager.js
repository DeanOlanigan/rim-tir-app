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

export function useToolsManager(stageRef, selectionBoxRef, tr) {
    const managerRef = useRef(null);
    const currentAction = useActionsStore((state) => state.currentAction);
    const selectedIds = useNodeStore((state) => state.selectedIds);

    if (!managerRef.current) {
        const addNode = useNodeStore.getState().addNode;
        const setSelectedIds = useNodeStore.getState().setSelectedIds;
        const getGrid = () => {
            const { gridSize, snapToGrid } = useActionsStore.getState();
            return { gridSize, snapToGrid };
        };
        const getWorkSize = () => {
            const size = useActionsStore.getState().size;
            return { workW: size.width, workH: size.height };
        };
        const api = {
            addNode,
            setSelectedIds,
            getGrid,
            getWorkSize,
        };

        const toolsMap = {
            select: createSelectTool({
                selectionBoxRef,
                selectedIds,
                setSelectedIds,
            }),
            hand: createHandTool({ stageRef }),
            square: createDrawRectTool({
                getStage: () => stageRef.current,
                getGrid,
                getWorkSize,
                addNode,
                setSelectedIds,
            }),
            ellipse: createDrawEllipseTool({
                getGrid,
                addNode,
            }),
            line: createDrawLineTool({
                getGrid,
                addNode,
            }),
            arrow: createDrawArrowTool({
                getGrid,
                addNode,
            }),
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
