import { useContextMenuStore } from "@/store/contextMenu-store";
import { ACTIONS, SCROLL_STRENGTH } from "../../constants";
import { useActionsStore } from "../../store/actions-store";
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
        active.onEnter && active.onEnter(null, ctx);
    };

    const popTemp = () => {
        const prev = active;
        const next = tempStack.pop() || null;
        if (!next) return;
        prev && prev.onExit && prev.onExit(next, ctx);
        active = next;
        useActionsStore.getState().setCurrentAction(active.name);
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

            const pointer = stage.getPointerPosition();
            const dir = e.evt.deltaY > 0 ? -1 : 1;

            if (e.evt.ctrlKey) {
                zoomByPercent(stage, dir, pointer);
            } else if (e.evt.shiftKey) {
                stage.position({
                    x: stage.x() + dir * SCROLL_STRENGTH,
                    y: stage.y(),
                });
            } else {
                stage.position({
                    x: stage.x(),
                    y: stage.y() + dir * SCROLL_STRENGTH,
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
            useContextMenuStore.getState().updateContext("sch", {
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
