import { useContextMenuStore } from "@/store/contextMenu-store";
import { useCallback } from "react";

export function useContextMenuPos(ref) {
    const { updateContext } = useContextMenuStore.getState();

    return useCallback(
        (e) => {
            e.evt.preventDefault();
            const stage = ref.current;
            if (!stage) return;
            const rect = stage.container().getBoundingClientRect();
            const p = stage.getPointerPosition();
            if (!p) return;
            updateContext("sch", {
                x: rect.left + p.x + 4,
                y: rect.top + p.y + 4,
                apiPath: e.target,
                visible: true,
            });
            e.cancelBubble = true;
        },
        [ref, updateContext]
    );
}
