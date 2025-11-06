import { useCallback } from "react";

export function useContextMenuPos(ref, setContextMenu) {
    return useCallback(
        (e) => {
            e.evt.preventDefault();
            const stage = ref.current;
            if (!stage) return;
            const rect = stage.container().getBoundingClientRect();
            const p = stage.getPointerPosition();
            if (!p) return;
            setContextMenu({
                x: rect.left + p.x + 4,
                y: rect.top + p.y + 4,
                type: e.target,
                visible: true,
            });
            e.cancelBubble = true;
        },
        [ref, setContextMenu]
    );
}
