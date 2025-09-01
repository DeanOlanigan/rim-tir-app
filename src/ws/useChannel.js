import { useEffect, useRef, useState } from "react";
import { bus } from "./socket-bus";

export function useChannel(channel, params) {
    const [value, setValue] = useState(null);
    const rafRef = useRef(0);
    const nextRef = useRef(null);

    useEffect(() => {
        const off = bus.on(
            channel,
            (d) => {
                nextRef.current = nextRef.current
                    ? { ...nextRef.current, ...d }
                    : d;
                if (!rafRef.current) {
                    rafRef.current = requestAnimationFrame(() => {
                        rafRef.current = 0;
                        setValue(nextRef.current);
                        nextRef.current = null;
                    });
                }
            },
            params
        );
        return () => {
            off();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channel, JSON.stringify(params)]);

    return value;
}
