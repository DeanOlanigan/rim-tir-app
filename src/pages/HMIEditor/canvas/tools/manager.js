import { ACTIONS } from "../../constants";
import { useActionsStore } from "../../store/actions-store";

export function createToolManager({ toolsMap, api }) {
    let active = toolsMap[ACTIONS.select];
    let tempSpaceActive = false;
    let pointerDown = false;
    const tempStack = [];

    const setCursor = (cursor) => {
        const stage = api.getStage();
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
        useActionsStore.getState().setCurrentAction(name);
        if (active.name !== ACTIONS.select) {
            api.setSelectedIds([]);
        }
    };

    const pushTemp = (name) => {
        const next = toolsMap[name];
        if (!next) return;
        if (active) tempStack.push(active);
        active = next;
        useActionsStore.getState().setCurrentAction(name);
        setCursor(active.cursor);
        active.onEnter && active.onEnter(null, { ...api, manager });
    };

    const popTemp = () => {
        const prev = active;
        const next = tempStack.pop() || null;
        if (!next) return;
        prev && prev.onExit && prev.onExit(next, { ...api, manager });
        active = next;
        useActionsStore.getState().setCurrentAction(active.name);
        setCursor(active && active.cursor);
    };

    const cancelActive = () => {
        active && active.cancel && active.cancel({ ...api, manager });
    };

    const handlers = {
        onPointerDown(e) {
            pointerDown = true;

            if (e.evt.button === 1) {
                pushTemp(ACTIONS.hand);
            }

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
            if (e.evt.button === 1) {
                popTemp();
            }
            pointerDown = false;
        },
        onKeyDown(e) {
            if (e.code === "Escape") {
                cancelActive();
                pointerDown = false;
                return;
            }
            if (e.code === "Space" && !tempSpaceActive) {
                if (pointerDown) return;
                tempSpaceActive = true;
                pushTemp(ACTIONS.hand);
                return;
            }
            active.onKeyDown?.call(active, e, { ...api, manager });
        },
        onKeyUp(e) {
            if (e.code === "Space" && tempSpaceActive) {
                tempSpaceActive = false;
                popTemp();
                return;
            }
            active.onKeyUp?.call(active, e, { ...api, manager });
        },
        cancel() {
            cancelActive();
        },
    };

    const manager = {
        setActive,
        getActive: () => active,
        pushTemp,
        popTemp,
        setCursor,
        handlers,
        toolsMap,
    };

    return manager;
}
