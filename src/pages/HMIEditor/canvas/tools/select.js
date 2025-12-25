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
                const parentGroups = e.target.findAncestors("Group");
                const clickedId =
                    parentGroups[parentGroups.length - 1]?.id() ||
                    e.target.id();

                const metaPressed =
                    e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
                const selectedIds = ctx.getSelectedIds();
                const isSelected = selectedIds.includes(clickedId);
                if (!metaPressed && !isSelected) {
                    ctx.setSelectedIds([clickedId]);
                } else if (!metaPressed && isSelected) {
                    ctx.setSelectedIds([clickedId]);
                } else if (metaPressed && isSelected) {
                    ctx.setSelectedIds(
                        selectedIds.filter((id) => id !== clickedId),
                    );
                } else if (metaPressed && !isSelected) {
                    ctx.setSelectedIds([...selectedIds, clickedId]);
                }
            } else if (e.target === stage) {
                ctx.setSelectedIds([]);
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

        /* onDblClick(e, ctx) {
            if (e.evt.button !== 0) return;
            const stage = e.currentTarget;
            if (!stage) return;
            if (e.target.hasName("node")) {
                const type = e.target.attrs.type;
                if (isLineLikeType(type)) {
                    ctx.manager.setActive(ACTIONS.vertex);
                }
            }
        }, */

        cancel(ctx) {
            hideBox(ctx);
            start = { x: 0, y: 0 };
        },
    };
}
