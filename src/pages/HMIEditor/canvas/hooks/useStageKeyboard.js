import { useEffect } from "react";

export function useStageKeyboard(canvasRef, manager) {
    useEffect(() => {
        const stage = canvasRef.current;
        if (stage) {
            stage
                .container()
                .addEventListener("keydown", manager.handlers.onKeyDown, false);
            stage
                .container()
                .addEventListener("keyup", manager.handlers.onKeyUp, false);
        }

        return () => {
            if (stage) {
                stage
                    .container()
                    .removeEventListener(
                        "keydown",
                        manager.handlers.onKeyDown,
                        false,
                    );
                stage
                    .container()
                    .removeEventListener(
                        "keyup",
                        manager.handlers.onKeyUp,
                        false,
                    );
            }
        };
    }, [canvasRef, manager.handlers]);
}
