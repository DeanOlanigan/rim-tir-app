import { LuMousePointer2 } from "react-icons/lu";
import { toWorld } from "../utils/coords";
import Konva from "konva";
import { ACTIONS } from "../../constants";

export function createSelectTool({
    getSelectionBox,
    getSelectedIds,
    setSelectedIds,
    getOverviewLayer,
}) {
    let start = { x: 0, y: 0 };

    const showBox = (attrs) =>
        getSelectionBox()?.setAttrs({ visible: true, ...attrs });
    const hideBox = () => getSelectionBox()?.setAttrs({ visible: false });

    return {
        name: ACTIONS.select,
        label: "Select",
        icon: LuMousePointer2,
        cursor: "default",

        onPointerDown(e) {
            if (e.evt.button !== 0) return;
            const stage = e.currentTarget;
            if (!stage) return;
            if (e.target.hasName("node")) {
                const clickedId = e.target.id();
                const metaPressed =
                    e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
                const isSelected = getSelectedIds().includes(clickedId);
                if (!metaPressed && !isSelected) {
                    setSelectedIds([clickedId]);
                } else if (metaPressed && isSelected) {
                    setSelectedIds(
                        getSelectedIds().filter((id) => id !== clickedId)
                    );
                } else if (metaPressed && !isSelected) {
                    setSelectedIds([...getSelectedIds(), clickedId]);
                }
            } else if (e.target === stage) {
                setSelectedIds([]);
                const wp = toWorld(stage, stage.getPointerPosition());
                start = wp;
                showBox({ x: wp.x, y: wp.y, width: 0, height: 0 });
            }
            getOverviewLayer().batchDraw();
        },

        onPointerMove(e) {
            const stage = e.currentTarget;
            const box = getSelectionBox();
            if (!stage || !box || !box.visible()) return;
            const wp = toWorld(stage, stage.getPointerPosition());
            box.setAttrs({
                x: Math.min(start.x, wp.x),
                y: Math.min(start.y, wp.y),
                width: Math.abs(wp.x - start.x),
                height: Math.abs(wp.y - start.y),
            });
            getOverviewLayer().batchDraw();
        },

        onPointerUp(e) {
            const stage = e.currentTarget;
            const box = getSelectionBox();
            if (!stage || !box || !box.visible()) return;
            hideBox();
            getOverviewLayer().batchDraw();
            const nodes = stage.find(".node");
            const selection =
                box.getClientRect({
                    skipShadow: true,
                    skipStroke: true,
                }) ?? null;
            const selected = nodes.filter((node) =>
                Konva.Util.haveIntersection(
                    selection,
                    node.getClientRect({ skipShadow: true, skipStroke: true })
                )
            );
            if (selected.length === 0) return;
            const selectedIds = selected.map((node) => node.attrs.id);
            setSelectedIds(selectedIds);
        },

        cancel() {
            hideBox();
            start = { x: 0, y: 0 };
        },
    };
}
