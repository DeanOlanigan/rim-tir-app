import { SHAPES } from "../../constants";
import { round4 } from "../../utils";
import { registerShape } from "./registry";

registerShape(SHAPES.group, {
    onTransformEnd(konvaNode) {
        return {
            x: round4(konvaNode.x()),
            y: round4(konvaNode.y()),
            width: round4(konvaNode.width()),
            height: round4(konvaNode.height()),
            rotation: round4(konvaNode.rotation()),
        };

        /* const x = round4(konvaNode.x());
        const y = round4(konvaNode.y());
        const width = round4(konvaNode.width() * konvaNode.scaleX());
        const height = round4(konvaNode.height() * konvaNode.scaleY());
        const rotation = round4(konvaNode.rotation());

        const children = konvaNode.getChildren();
        if (children.length === 0) return;
        const ids = children.map((node) => node.id());
        let patchesById = {};
        for (const child of children) {
            const id = child.attrs.id;
            patchesById[id] = {
                x: round4(child.x()),
                y: round4(child.y()),
                width: round4(child.width()),
                height: round4(child.height()),
                rotation: round4(child.rotation()),
            };
        }
        useNodeStore.getState().updateNodes(ids, patchesById);

        const patch = {
            x,
            y,
            width,
            height,
            rotation,
        };

        konvaNode.scaleX(1);
        konvaNode.scaleY(1);

        return patch; */
    },

    onTransform() {
        console.log("Transform group");
        /* const parent = konvaNode.getParent();
        if (!parent) return;

        const parentAbs = parent.getAbsoluteTransform();
        const parentAbsInv = parentAbs.copy().invert();

        konvaNode.getChildren().forEach((child) => {
            const childAbs = child.getAbsoluteTransform();

            const newLocalTr = new Konva.Transform();
            newLocalTr.multiply(parentAbsInv).multiply(childAbs);

            const attrs = newLocalTr.decompose();

            const w = child.width() * attrs.scaleX;
            const h = child.height() * attrs.scaleY;

            child.setAttrs({
                x: round4(attrs.x),
                y: round4(attrs.y),
                width: round4(w),
                height: round4(h),
                rotation: round4(attrs.rotation),
                scaleX: 1,
                scaleY: 1,
            });
        }); */
    },

    toModelFromKonva(konvaNode) {
        const a = konvaNode.attrs;
        return {
            type: SHAPES.group,
            id: a.id,
            x: round4(a.x),
            y: round4(a.y),
            width: Math.round(a.width),
            height: Math.round(a.height),
            rotation: round4(a.rotation),
        };
    },
});
