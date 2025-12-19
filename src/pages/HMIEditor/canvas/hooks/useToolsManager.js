import { useEffect, useRef } from "react";
import { createToolManager } from "../tools/manager";
import { createHandTool } from "../tools/hand";
import { createSelectTool } from "../tools/select";
import { createDrawRectTool } from "../tools/drawRect";
import { createDrawEllipseTool } from "../tools/drawEllipse";
import { createDrawLineTool } from "../tools/drawLine";
import { createDrawArrowTool } from "../tools/drawArrow";
import { ACTIONS } from "../../constants";
import { createDrawTextTool } from "../tools/drawText";
import { createCanvasApi } from "../utils/createCanvasApi";
import { useNodeStore } from "../../store/node-store";
import { useActionsStore } from "../../store/actions-store";
import { useContextMenuStore } from "@/store/contextMenu-store";
import { createStateApi } from "../utils/createStateApi";
import { createDrawVariablePolygonTool } from "../tools/drawVariablePolygon";
import { createVertexTool } from "../tools/vertexEditor";

export function useToolsManager() {
    const managerRef = useRef(null);
    const canvasRef = useRef(null);
    const selectionBoxRef = useRef(null);
    const transformerRef = useRef(null);
    const nodesLayerRef = useRef(null);
    const overviewLayerRef = useRef(null);
    const nodesRef = useRef(new Map());
    const apiRef = useRef(null);

    if (!managerRef.current) {
        const stateApi = createStateApi(
            useNodeStore,
            useActionsStore,
            useContextMenuStore,
        );
        const api = createCanvasApi({
            canvasRef,
            selectionBoxRef,
            transformerRef,
            overviewLayerRef,
            nodesLayerRef,
            nodesRef,
            stateApi,
        });
        apiRef.current = api;
        const toolsMap = {
            [ACTIONS.select]: createSelectTool(),
            [ACTIONS.vertex]: createVertexTool(),
            [ACTIONS.hand]: createHandTool(),
            [ACTIONS.square]: createDrawRectTool(),
            [ACTIONS.polygon]: createDrawVariablePolygonTool(),
            [ACTIONS.ellipse]: createDrawEllipseTool(),
            [ACTIONS.text]: createDrawTextTool(),
            [ACTIONS.line]: createDrawLineTool(),
            [ACTIONS.arrow]: createDrawArrowTool(),
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
        nodesLayerRef,
        overviewLayerRef,
        nodesRef,
        api: apiRef.current,
    };
}
