import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useNodeStore } from "../../store/node-store";
import { useActionsStore } from "../../store/actions-store";
import { createToolManager } from "../tools/manager";
import { createHandTool } from "../tools/hand";
import { createSelectTool } from "../tools/select";
import { createDrawRectTool } from "../tools/drawRect";
import { createDrawEllipseTool } from "../tools/drawEllipse";
import { createDrawLineTool } from "../tools/drawLine";
import { createDrawArrowTool } from "../tools/drawArrow";
import { ACTIONS } from "../../store/actions";

function getApi({ canvasRef, selectionBoxRef, transformerRef, layerRef }) {
    const getStage = () => canvasRef.current;
    const getSelectionBox = () => selectionBoxRef.current;
    const getTransformer = () => transformerRef.current;
    const getLayer = () => layerRef.current;
    const getSelectedIds = () => useNodeStore.getState().selectedIds;
    const setSelectedIds = (ids) => useNodeStore.getState().setSelectedIds(ids);
    const addNode = (id, patch) => useNodeStore.getState().addNode(id, patch);
    const getGrid = () => {
        const { gridSize, snapToGrid } = useActionsStore.getState();
        return { gridSize, snapToGrid };
    };
    const getWorkSize = () => {
        const size = useActionsStore.getState().size;
        return { workW: size.width, workH: size.height };
    };

    return {
        getStage,
        getSelectionBox,
        getTransformer,
        getLayer,
        getSelectedIds,
        setSelectedIds,
        addNode,
        getGrid,
        getWorkSize,
    };
}

export function useToolsManager() {
    const managerRef = useRef(null);
    const canvasRef = useRef(null);
    const selectionBoxRef = useRef(null);
    const transformerRef = useRef(null);
    const layerRef = useRef(null);

    if (!managerRef.current) {
        const api = getApi({
            canvasRef,
            selectionBoxRef,
            transformerRef,
            layerRef,
        });
        const toolsMap = {
            [ACTIONS.select]: createSelectTool({ ...api }),
            [ACTIONS.hand]: createHandTool({ ...api }),
            [ACTIONS.square]: createDrawRectTool({ ...api }),
            [ACTIONS.ellipse]: createDrawEllipseTool({ ...api }),
            [ACTIONS.line]: createDrawLineTool({ ...api }),
            [ACTIONS.arrow]: createDrawArrowTool({ ...api }),
        };
        managerRef.current = createToolManager({ toolsMap, api });
    }

    useEffect(() => {
        const onKeyDown = (e) => managerRef.current.handlers.onKeyDown(e);
        const onKeyUp = (e) => managerRef.current.handlers.onKeyUp(e);
        window.addEventListener("keydown", onKeyDown, false);
        window.addEventListener("keyup", onKeyUp, false);
        return () => {
            window.removeEventListener("keydown", onKeyDown, false);
            window.removeEventListener("keyup", onKeyUp, false);
        };
    }, []);

    return {
        manager: managerRef.current,
        canvasRef,
        selectionBoxRef,
        transformerRef,
        layerRef,
    };
}
