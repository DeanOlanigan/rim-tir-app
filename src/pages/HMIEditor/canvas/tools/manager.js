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
        if (active.name !== ACTIONS.select && active.name !== ACTIONS.vertex) {
            api.setSelectedIds([]);
        }
    };

    const pushTemp = (name) => {
        const next = toolsMap[name];
        if (!next) return;
        if (active) tempStack.push(active);
        api.tools.setPrevAction(active.name);
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
        api.tools.setPrevAction(prev.name);
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
        onClick(e) {
            active && active.onClick && active.onClick(e, ctx);
        },
        onDblClick(e) {
            active && active.onDblClick && active.onDblClick(e, ctx);
        },
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
            if (active.name === ACTIONS.hand && pointerDown) return;
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
            if (active.name === ACTIONS.hand || pointerDown) return;
            const target = e.target;
            const parentGroups = target.findAncestors("Group");
            const id =
                parentGroups[parentGroups.length - 1]?.id() || target.id();
            const selectedIds = api.getSelectedIds();
            let ids = id ? selectedIds : [];
            if (id && !selectedIds.includes(id)) {
                api.setSelectedIds([id]);
                ids = [id];
            }

            api.updateContextMenu("sch", {
                x: e.evt.clientX + 4,
                y: e.evt.clientY + 4,
                apiPath: ids,
                visible: true,
            });
            e.cancelBubble = true;
        },
    };

    manager.handlers = handlers;

    return manager;
}
