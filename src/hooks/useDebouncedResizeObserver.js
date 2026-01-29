import debounce from "debounce";
import { useMemo, useState } from "react";
import useResizeObserver from "use-resize-observer";

export function useDebouncedResizeObserver(wait = 150) {
    const [size, setSize] = useState({});

    const onResize = useMemo(
        () =>
            debounce(
                ({ width, height }) => {
                    setSize({ width, height });
                },
                wait,
                false, // trailing = false означает, что вызов произойдёт после паузы
            ),
        [wait],
    );

    const { ref } = useResizeObserver({ onResize });

    return { ref, ...size };
}
