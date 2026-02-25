import { useEffect } from "react";
import {
    getPasteData,
    pasteFromClipboardEvent,
} from "../../actions/clipboardActions";

export function useStageKeyboard(canvasRef, manager, tools) {
    useEffect(() => {
        const stage = canvasRef.current;

        const onPaste = async (e) => {
            const {
                store,
                worldX,
                worldY,
                gridSize,
                scale,
                viewportHeight,
                viewportWidth,
            } = getPasteData(tools);

            const handled = await pasteFromClipboardEvent(store, e, {
                worldX,
                worldY,
                gridSize,
                scale,
                viewportHeight,
                viewportWidth,
            });

            if (handled) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        if (stage) {
            stage
                .container()
                .addEventListener("keydown", manager.handlers.onKeyDown, false);
            stage
                .container()
                .addEventListener("keyup", manager.handlers.onKeyUp, false);
            stage.container().addEventListener("paste", onPaste, false);
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
                stage.container().removeEventListener("paste", onPaste, false);
            }
        };
    }, [canvasRef, manager.handlers, tools]);
}
