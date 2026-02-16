import { useEffect } from "react";
import { useMemo } from "react";
import throttle from "throttleit";
import useResizeObserver from "use-resize-observer";
import { useActionsStore } from "../store/actions-store";

export function useHMICanvasResize(wait = 150) {
    const onResize = useMemo(
        () =>
            throttle(({ width, height }) => {
                useActionsStore.getState().setCanvasSize({ width, height });
            }, wait),
        [wait],
    );

    useEffect(() => {
        return () => onResize?.cancel?.();
    }, [onResize]);

    const { ref } = useResizeObserver({ onResize });

    return { ref };
}
