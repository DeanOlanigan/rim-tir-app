import { useEffect, useMemo, useState } from "react";
import throttle from "throttleit";
import useResizeObserver from "use-resize-observer";

export function useThrottledResizeObserver(wait = 150) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    const onResize = useMemo(
        () =>
            throttle(({ width, height }) => {
                setSize({ width, height });
            }, wait),
        [wait],
    );

    useEffect(() => {
        return () => onResize?.cancel?.();
    }, [onResize]);

    const { ref } = useResizeObserver({ onResize });

    return { ref, ...size };
}
