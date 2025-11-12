import { LuMousePointer2 } from "react-icons/lu";
import { ACTIONS } from "../../store/actions";
import { toWorld } from "../utils/coords";
import Konva from "konva";

export function createSelectTool({ selectionBoxRef, setSelectedIds, tr }) {
    let start = { x: 0, y: 0 };

    const showBox = (attrs) =>
        selectionBoxRef.current?.setAttrs({ visible: true, ...attrs });
    const hideBox = () => selectionBoxRef.current?.setAttrs({ visible: false });

    return {
        name: ACTIONS.select,
        label: "Select",
        icon: LuMousePointer2,
        cursor: "default",

        onPointerDown(e) {
            if (e.evt.button !== 0) return;
            const stage = e.currentTarget;
            if (!stage || e.target !== stage) return;
            tr.current.nodes([]);
            setSelectedIds([]);
            const wp = toWorld(stage, stage.getPointerPosition());
            start = wp;
            showBox({ x: wp.x, y: wp.y, width: 0, height: 0 });
        },

        onPointerMove(e) {
            const stage = e.currentTarget;
            const box = selectionBoxRef.current;
            if (!stage || !box || !box.visible()) return;
            const wp = toWorld(stage, stage.getPointerPosition());
            box.setAttrs({
                x: Math.min(start.x, wp.x),
                y: Math.min(start.y, wp.y),
                width: Math.abs(wp.x - start.x),
                height: Math.abs(wp.y - start.y),
            });
        },

        onPointerUp(e) {
            if (e.evt.button !== 0) return;
            const stage = e.currentTarget;
            const box = selectionBoxRef.current;
            if (!stage || !box || !box.visible()) return;
            hideBox();
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
            const selectedIds = selected.map((node) => node.attrs.id);
            tr.current.nodes(selected);
            setSelectedIds(selectedIds);
        },

        cancel() {
            hideBox();
        },
    };
}
