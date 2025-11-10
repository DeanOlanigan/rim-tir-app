export function createToolManager({ stageRef, tools }) {
    let active = null;
    let prevBeforeTemp = null;

    const setCursor = (cursor) => {
        const stage = stageRef.current;
        if (stage) stage.container().style.cursor = cursor || "default";
    };

    const setActive = (name) => {
        const tool = tools[name];
        if (!tool) return;
        if (active && active.cancel) active.cancel();
        active = tool;
        setCursor(active.cursor);
    };

    const pushTemp = (name) => {
        if (!prevBeforeTemp) prevBeforeTemp = active?.name || null;
        setActive(name);
    };

    const popTemp = () => {
        if (prevBeforeTemp) setActive(prevBeforeTemp || null);
        prevBeforeTemp = null;
    };

    const handlers = {
        onPointerDown: (e) => active?.onPointerDown?.(e),
        onPointerMove: (e) => active?.onPointerMove?.(e),
        onPointerUp: (e) => active?.onPointerUp?.(e),
        onKeyDown: (e) => active?.onKeyDown?.(e),
        onKeyUp: (e) => active?.onKeyUp?.(e),
    };

    return {
        setActive,
        getActive: () => active,
        pushTemp,
        popTemp,
        setCursor,
        handlers,
    };
}
