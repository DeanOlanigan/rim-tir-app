import { useCallback, useRef } from "react";
import { toWorld } from "../utils/coords";
import Konva from "konva";

export function useSelectionBox() {
    const box = useRef(null);
    const start = useRef({ x: 0, y: 0 });

    const begin = useCallback((e) => {
        const stage = e.currentTarget;
        if (!stage) return;
        if (e.target !== stage) return;
        const wp = toWorld(stage, stage.getPointerPosition());
        start.current = wp;
        box.current?.setAttrs({
            x: wp.x,
            y: wp.y,
            width: 0,
            height: 0,
            visible: true,
        });
    }, []);

    const move = useCallback((e) => {
        const stage = e.currentTarget;
        if (!stage || !box.current.attrs.visible) return;
        const wp = toWorld(stage, stage.getPointerPosition());
        box.current?.setAttrs({
            x: Math.min(start.current.x, wp.x),
            y: Math.min(start.current.y, wp.y),
            width: Math.abs(wp.x - start.current.x),
            height: Math.abs(wp.y - start.current.y),
        });
    }, []);

    const end = useCallback((e) => {
        const stage = e.currentTarget;
        if (!stage || !box.current.attrs.visible) return;
        box.current?.setAttr("visible", false);
        const nodes = stage.find(".node");

        const selection =
            box.current?.getClientRect({
                skipShadow: true,
                skipStroke: true,
            }) ?? null;

        const selected = nodes.filter((node) =>
            Konva.Util.haveIntersection(selection, node.getClientRect())
        );

        return selected;
    }, []);

    return { box, begin, move, end };
}
