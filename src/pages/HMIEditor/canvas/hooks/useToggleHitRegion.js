import { useEffect } from "react";
import { useActionsStore } from "../../store/actions-store";

export function useToggleHitRegion(canvasRef, nodesLayerRef) {
    const showHitRegions = useActionsStore((state) => state.showHitRegions);
    useEffect(() => {
        if (showHitRegions) {
            canvasRef.current
                .container()
                .appendChild(nodesLayerRef.current.hitCanvas._canvas);

            nodesLayerRef.current.hitCanvas._canvas.style.position = "absolute";
            nodesLayerRef.current.hitCanvas._canvas.style.top = 0;
            nodesLayerRef.current.hitCanvas._canvas.style.left = 0;
        } else {
            nodesLayerRef.current.hitCanvas._canvas.remove();
        }
    }, [showHitRegions, nodesLayerRef, canvasRef]);
}
