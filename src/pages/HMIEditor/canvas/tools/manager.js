import { ACTIONS } from "../../constants";
import { zoomByPercent } from "../utils/zoomService";

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
            prev.onExit(next, ctx);
        }

        active = next;
        setCursor(active.cursor);
        if (active.onEnter) {
            active.onEnter(prev, ctx);
        }
        api.setCurrentAction(name);
        if (active.name !== ACTIONS.select) {
            api.setSelectedIds([]);
        }
    };

    const pushTemp = (name) => {
        const next = toolsMap[name];
        if (!next) return;
        if (active) tempStack.push(active);
        active = next;
        api.setCurrentAction(name);
        setCursor(active.cursor);
        active.onEnter && active.onEnter(null, ctx);
    };

    const popTemp = () => {
        const prev = active;
        const next = tempStack.pop() || null;
        if (!next) return;
        prev && prev.onExit && prev.onExit(next, ctx);
        active = next;
        api.setCurrentAction(active.name);
        setCursor(active && active.cursor);
    };

    const cancelActive = () => {
        active && active.cancel && active.cancel(ctx);
    };

    const manager = {
        setActive,
        getActive: () => active,
        pushTemp,
        popTemp,
        setCursor,
        handlers: {},
        toolsMap,
    };

    const ctx = { ...api, manager };

    const handlers = {
        onPointerDown(e) {
            pointerDown = true;

            if (e.evt.button === 1) {
                pushTemp(ACTIONS.hand);
            }

            active && active.onPointerDown && active.onPointerDown(e, ctx);
        },
        onPointerMove(e) {
            active && active.onPointerMove && active.onPointerMove(e, ctx);
        },
        onPointerUp(e) {
            active && active.onPointerUp && active.onPointerUp(e, ctx);
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
            active.onKeyDown?.call(active, e, ctx);
        },
        onKeyUp(e) {
            if (e.code === "Space" && tempSpaceActive) {
                tempSpaceActive = false;
                popTemp();
                return;
            }
            active.onKeyUp?.call(active, e, ctx);
        },
        onWheel(e) {
            e.evt.preventDefault();
            const stage = e.currentTarget;
            if (!stage) return;
            const { ctrlKey, metaKey, shiftKey, deltaY, deltaX } = e.evt;
            const pointer = stage.getPointerPosition();
            if (metaKey || ctrlKey) {
                let dir = -deltaY * 0.1;
                if (dir > 1) dir = 1;
                if (dir < -1) dir = -1;
                if (dir !== 0) {
                    zoomByPercent(stage, dir, pointer);
                    stage.batchDraw();
                }
                return;
            }
            const panX = -deltaX * 1;
            const panY = -deltaY * 1;
            if (shiftKey) {
                stage.position({
                    x: stage.x() + (panX || panY),
                    y: stage.y(),
                });
            } else {
                stage.position({
                    x: stage.x() + panX,
                    y: stage.y() + panY,
                });
            }
            stage.batchDraw();
        },
        onContextMenu(e) {
            e.evt.preventDefault();
            const stage = e.currentTarget;
            if (!stage) return;
            const rect = stage.container().getBoundingClientRect();
            const p = stage.getPointerPosition();
            if (!p) return;
            const target = e.target;
            const id =
                typeof target.id === "function" ? target.id() : undefined;
            api.updateContextMenu("sch", {
                x: rect.left + p.x + 4,
                y: rect.top + p.y + 4,
                apiPath: id,
                visible: true,
            });
            e.cancelBubble = true;
        },
    };

    manager.handlers = handlers;

    return manager;
}
