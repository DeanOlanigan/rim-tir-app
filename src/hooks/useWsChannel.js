import { bus } from "@/services/rwebsocket";
import { useEffect, useRef, useState } from "react";

export function useChannel(channel) {
    const [data, setData] = useState(null);
    const rafRef = useRef();
    const nextRef = useRef(null);

    useEffect(() => {
        const dispose = bus.sub(channel, (d) => {
            nextRef.current = d;
            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(() => {
                    rafRef.current = undefined;
                    setData(nextRef.current);
                });
            }
        });
        return () => {
            dispose();
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [channel]);

    return data;
}
