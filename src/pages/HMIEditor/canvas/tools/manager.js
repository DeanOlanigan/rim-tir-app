export function createToolManager({ stageRef, toolsMap, api }) {
    let active = null;
    const tempStack = [];

    const getStage = () => stageRef.current;

    const setCursor = (cursor) => {
        const stage = getStage();
        if (!stage) return;
        const container = stage.container();
        container.style.cursor = cursor || "default";
    };

    const setActive = (name) => {
        const next = toolsMap[name];
        if (!next) {
            console.warn(`Tool "${name}" not found`);
            return;
        }

        const prev = active;
        if (prev && prev.onExit) {
            prev.onExit(next, { ...api, manager });
        }

        active = next;
        setCursor(active.cursor);
        if (active.onEnter) {
            active.onEnter(prev, { ...api, manager });
        }
    };

    const pushTemp = (name) => {
        const next = toolsMap[name];
        if (!next) return;
        if (active) tempStack.push(active);
        active = next;
        setCursor(active.cursor);
        active.onEnter && active.onEnter(null, { ...api, manager });
    };

    const popTemp = () => {
        const prev = active;
        const next = tempStack.pop() || null;
        prev && prev.onExit && prev.onExit(next, { ...api, manager });
        active = next;
        setCursor(active && active.cursor);
    };

    const handlers = {
        onPointerDown(e) {
            active &&
                active.onPointerDown &&
                active.onPointerDown(e, { ...api, manager });
        },
        onPointerMove(e) {
            active &&
                active.onPointerMove &&
                active.onPointerMove(e, { ...api, manager });
        },
        onPointerUp(e) {
            active &&
                active.onPointerUp &&
                active.onPointerUp(e, { ...api, manager });
        },
        onKeyDown(e) {
            active &&
                active.onKeyDown &&
                active.onKeyDown(e, { ...api, manager });
        },
        onKeyUp(e) {
            active && active.onKeyUp && active.onKeyUp(e, { ...api, manager });
        },
        cancel() {
            active && active.cancel && active.cancel({ ...api, manager });
        },
    };

    const manager = {
        setActive,
        getActive: () => active,
        pushTemp,
        popTemp,
        setCursor,
        handlers,
    };

    return manager;
}
