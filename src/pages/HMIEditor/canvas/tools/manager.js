import {
    ACTIONS,
    ALT_MOVE_CANVAS_STRENGTH,
    ALT_MOVE_PRIMITIVE_STRENGTH,
    MOVE_CANVAS_STRENGTH,
    MOVE_PRIMITIVE_STRENGTH,
} from "../../constants";
import { useActionsStore } from "../../store/actions-store";
import { useNodeStore } from "../../store/node-store";
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
            if (api.ui.viewOnlyMode()) return;
            active && active.onClick && active.onClick(e, ctx);
        },
        onDblClick(e) {
            if (api.ui.viewOnlyMode()) return;
            active && active.onDblClick && active.onDblClick(e, ctx);
        },
        onPointerDown(e) {
            pointerDown = true;
            const stage = e.target.getStage();

            if (e.evt.button === 1) {
                pushTemp(ACTIONS.hand);
            }

            if (api.ui.viewOnlyMode() && active.name !== ACTIONS.hand) return;

            active && active.onPointerDown && active.onPointerDown(e, ctx);

            const onGlobalMove = (evt) => {
                stage.setPointersPositions(evt);

                const syntheticEvent = {
                    ...e,
                    target: stage,
                    currentTarget: stage,
                    evt,
                };

                active &&
                    active.onPointerMove &&
                    active.onPointerMove(syntheticEvent, ctx);
            };

            const onGlobalUp = (evt) => {
                stage.setPointersPositions(evt);

                const syntheticEvent = {
                    ...e,
                    target: stage,
                    currentTarget: stage,
                    evt,
                };

                active &&
                    active.onPointerUp &&
                    active.onPointerUp(syntheticEvent, ctx);

                if (e.evt.button === 1) {
                    popTemp();
                }

                pointerDown = false;

                window.removeEventListener("pointermove", onGlobalMove);
                window.removeEventListener("pointerup", onGlobalUp);
            };

            window.addEventListener("pointermove", onGlobalMove);
            window.addEventListener("pointerup", onGlobalUp);
        },
        onKeyDown(e) {
            if (api.ui.viewOnlyMode()) return;

            if (
                ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                    e.code,
                )
            ) {
                arrowKeysHandler(e, api);
                return;
            }

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
            if (api.ui.viewOnlyMode()) return;
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
            if (
                active.name === ACTIONS.hand ||
                pointerDown ||
                api.ui.viewOnlyMode()
            )
                return;
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

function arrowKeysHandler(e, api) {
    const selectedIds = api.getSelectedIds();
    if (selectedIds.length > 0) {
        movePrimitive(e, selectedIds);
    } else {
        moveCanvas(e, api);
    }
}

function movePrimitive(e, selectedIds) {
    e.preventDefault();
    const { gridSize, snapToGrid } = useActionsStore.getState();
    let step = e.shiftKey
        ? ALT_MOVE_PRIMITIVE_STRENGTH
        : MOVE_PRIMITIVE_STRENGTH;
    if (snapToGrid) step = step * gridSize;
    let dx = 0;
    let dy = 0;
    if (e.code === "ArrowLeft") dx = -step;
    if (e.code === "ArrowRight") dx = step;
    if (e.code === "ArrowUp") dy = -step;
    if (e.code === "ArrowDown") dy = step;

    const store = useNodeStore.getState();
    const patches = {};
    selectedIds.forEach((id) => {
        const node = store.nodes[id];
        patches[id] = { x: node.x + dx, y: node.y + dy };
    });
    store.updateNodes(selectedIds, patches);
}

function moveCanvas(e, api) {
    e.preventDefault();
    const stage = api.getStage();
    let step = e.shiftKey ? ALT_MOVE_CANVAS_STRENGTH : MOVE_CANVAS_STRENGTH;
    let dx = 0;
    let dy = 0;
    if (e.code === "ArrowLeft") dx = step;
    if (e.code === "ArrowRight") dx = -step;
    if (e.code === "ArrowUp") dy = step;
    if (e.code === "ArrowDown") dy = -step;
    stage.position({
        x: stage.x() + dx,
        y: stage.y() + dy,
    });
    stage.batchDraw();
}
