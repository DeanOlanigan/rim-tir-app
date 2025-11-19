import { useContextMenuStore } from "@/store/contextMenu-store";
import { useCallback } from "react";

export function useContextMenuPos(canvasRef) {
    return useCallback(
        (e) => {
            e.evt.preventDefault();
            const stage = canvasRef.current;
            if (!stage) return;
            const rect = stage.container().getBoundingClientRect();
            const p = stage.getPointerPosition();
            if (!p) return;
            const target = e.target;
            const id =
                typeof target.id === "function" ? target.id() : undefined;
            useContextMenuStore.getState().updateContext("sch", {
                x: rect.left + p.x + 4,
                y: rect.top + p.y + 4,
                apiPath: id,
                visible: true,
            });
            e.cancelBubble = true;
        },
        [canvasRef]
    );
}
