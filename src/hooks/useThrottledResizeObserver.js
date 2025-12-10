import { useMemo, useState } from "react";
import throttle from "throttleit";
import useResizeObserver from "use-resize-observer";

export function useThrottledResizeObserver(wait = 150) {
    const [size, setSize] = useState({ width: 100, height: 100 });

    const onResize = useMemo(
        () =>
            throttle(({ width, height }) => {
                setSize({ width, height });
            }, wait),
        [wait],
    );

    const { ref } = useResizeObserver({ onResize });

    return { ref, ...size };
}
