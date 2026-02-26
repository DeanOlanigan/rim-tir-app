import { LuMousePointer2 } from "react-icons/lu";
import { toWorld } from "../utils/coords";
import Konva from "konva";
import { ACTIONS } from "../../constants";

export function createSelectTool() {
    let start = { x: 0, y: 0 };
    const minSize = 4;

    const showBox = (ctx, attrs) =>
        ctx.getSelectionBox()?.setAttrs({ visible: true, ...attrs });
    const hideBox = (ctx) =>
        ctx.getSelectionBox()?.setAttrs({ visible: false });

    /**
     * Возвращает id для выделения:
     * - обычный клик: поднимаемся к верхней группе (как сейчас)
     * - Alt+клик: глубокое выделение (сам узел)
     */
    const resolveClickedId = (target, evt) => {
        if (!target?.hasName?.("node")) return null;

        const deepSelect = evt.ctrlKey; // <-- модификатор глубокого выделения
        if (deepSelect) {
            return target.id();
        }

        const parentGroups = target.findAncestors("Group");
        return parentGroups[parentGroups.length - 1]?.id() || target.id();
    };

    const isMetaPressed = (evt) => evt.shiftKey;

    const applySelectionClick = (e, ctx, { allowToggle = true } = {}) => {
        if (e.evt.button !== 0) return false;
        if (!e.target?.hasName?.("node")) return false;

        const clickedId = resolveClickedId(e.target, e.evt);
        if (!clickedId) return false;

        const metaPressed = isMetaPressed(e.evt);
        const selectedIds = ctx.getSelectedIds();
        const isSelected = selectedIds.includes(clickedId);

        if (!metaPressed) {
            if (!isSelected || selectedIds.length !== 1) {
                ctx.setSelectedIds([clickedId]);
            }
            return true;
        }

        // toggle по Ctrl/Cmd/Shift
        if (allowToggle) {
            if (isSelected) {
                ctx.setSelectedIds(
                    selectedIds.filter((id) => id !== clickedId),
                );
            } else {
                ctx.setSelectedIds([...selectedIds, clickedId]);
            }
        }

        return true;
    };

    return {
        name: ACTIONS.select,
        label: "Select",
        icon: LuMousePointer2,
        cursor: "default",

        onPointerDown(e, ctx) {
            if (e.evt.button !== 0) return;

            const stage = e.currentTarget;
            if (!stage) return;

            if (e.target.hasName("node")) {
                applySelectionClick(e, ctx, { allowToggle: true });
            } else if (e.target === stage) {
                if (ctx.getSelectedIds().length > 0) ctx.setSelectedIds([]);
                const wp = toWorld(stage, stage.getPointerPosition());
                start = wp;
                showBox(ctx, { x: wp.x, y: wp.y, width: 0, height: 0 });
            }
            ctx.getOverviewLayer().batchDraw();
        },

        onPointerMove(e, ctx) {
            const stage = e.currentTarget;
            const box = ctx.getSelectionBox();
            if (!stage || !box || !box.visible()) return;

            const wp = toWorld(stage, stage.getPointerPosition());
            box.setAttrs({
                x: Math.min(start.x, wp.x),
                y: Math.min(start.y, wp.y),
                width: Math.abs(wp.x - start.x),
                height: Math.abs(wp.y - start.y),
            });
            ctx.getOverviewLayer().batchDraw();
        },

        onPointerUp(e, ctx) {
            const stage = e.currentTarget;
            const box = ctx.getSelectionBox();
            if (!stage || !box || !box.visible()) return;

            hideBox(ctx);
            ctx.getOverviewLayer().batchDraw();

            if (box.attrs.width < minSize || box.attrs.height < minSize) return;

            const nodes = ctx.getNodesLayer().getChildren();
            const selection =
                box.getClientRect({
                    skipShadow: true,
                    skipStroke: true,
                }) ?? null;

            const selected = nodes.filter((node) =>
                Konva.Util.haveIntersection(
                    selection,
                    node.getClientRect({ skipShadow: true, skipStroke: true }),
                ),
            );

            if (selected.length === 0) return;

            const selectedIds = selected.map((node) => node.attrs.id);
            ctx.setSelectedIds(selectedIds);
        },

        onClick(e, ctx) {
            if (e.evt.button !== 0) return;

            if (e.target.hasName("node")) {
                const metaPressed = isMetaPressed(e.evt);
                if (!metaPressed)
                    applySelectionClick(e, ctx, { allowToggle: false });
            }
        },

        cancel(ctx) {
            hideBox(ctx);
            start = { x: 0, y: 0 };
        },
    };
}
