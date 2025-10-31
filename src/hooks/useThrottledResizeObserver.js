import { useMemo, useState } from "react";
import throttle from "throttleit";
import useResizeObserver from "use-resize-observer";

export function useThrottledResizeObserver(wait = 150) {
    const [size, setSize] = useState({});

    const onResize = useMemo(
        () =>
            throttle(({ width, height }) => {
                setSize({ width, height });
            }, wait),
        [wait]
    );

    const { ref } = useResizeObserver({ onResize });

    return { ref, ...size };
}
