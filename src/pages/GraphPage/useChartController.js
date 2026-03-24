import { useCallback, useState } from "react";

export function useChartController(grafRef) {
    const [paused, setPaused] = useState(false);

    const resetZoom = useCallback(() => {
        const chart = grafRef.current ?? null;
        chart?.resetZoom?.();
    }, [grafRef]);

    const togglePause = useCallback(() => {
        const chart = grafRef.current ?? null;

        const rt = chart?.options?.scales?.x?.realtime;
        if (!rt) return;

        rt.pause = !rt.pause;
        setPaused(rt.pause);
        chart?.update?.("none");
    }, [grafRef]);

    return { paused, resetZoom, togglePause };
}
