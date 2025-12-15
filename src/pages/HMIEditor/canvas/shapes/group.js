import { Transform } from "konva/lib/Util";
import { SHAPES } from "../../constants";
import { round4 } from "../../utils";
import { getShape, registerShape } from "./registry";

registerShape(SHAPES.group, {
    onTransformEnd(groupNode) {
        const groupId = groupNode.attrs.id;
        const clientRect = groupNode.getClientRect({
            relativeTo: groupNode.parent,
        });

        const groupPatch = {
            x: round4(groupNode.x()),
            y: round4(groupNode.y()),
            rotation: round4(groupNode.rotation()),
            width: round4(clientRect.width),
            height: round4(clientRect.height),
        };

        const children = groupNode.getChildren();
        if (children.length === 0) {
            groupNode.scaleX(1);
            groupNode.scaleY(1);
            return { [groupId]: groupPatch };
        }

        const absByChild = new Map();

        for (const ch of children) {
            if (!ch?.getStage?.()) continue;
            absByChild.set(ch._id, ch.getAbsoluteTransform().copy());
        }

        const sx = groupNode.scaleX();
        const sy = groupNode.scaleY();
        groupNode.scale({ x: 1, y: 1 });
        const groupAbsNoScale = groupNode.getAbsoluteTransform().copy();
        groupNode.scale({ x: sx, y: sy });

        const patch = { [groupId]: groupPatch };

        for (const ch of children) {
            if (!ch?.getStage?.()) continue;

            const childAbsVisual = absByChild.get(ch._id);
            if (!childAbsVisual) continue;

            const childLocalNew = new Transform()
                .multiply(groupAbsNoScale.copy().invert())
                .multiply(childAbsVisual);

            const attrs = childLocalNew.decompose();
            ch.setAttrs(attrs);

            const type = ch.attrs.type;
            const id = ch.attrs.id;
            const shape = getShape(type);

            if (!shape?.onTransformEnd) {
                console.warn("No onTransformEnd handler for shape type:", type);
                continue;
            }
            const res = shape.onTransformEnd(ch);
            if (type === SHAPES.group) {
                Object.assign(patch, res);
            } else {
                patch[id] = res;
            }
        }

        groupNode.scale({ x: 1, y: 1 });
        return patch;
    },

    onTransform(groupNode) {
        const groupId = groupNode.attrs.id;
        const clientRect = groupNode.getClientRect({
            relativeTo: groupNode.parent,
        });

        const groupPatch = {
            x: round4(groupNode.x()),
            y: round4(groupNode.y()),
            rotation: round4(groupNode.rotation()),
            width: round4(clientRect.width),
            height: round4(clientRect.height),
        };

        const children = groupNode.getChildren();
        if (children.length === 0) {
            groupNode.scaleX(1);
            groupNode.scaleY(1);
            return { [groupId]: groupPatch };
        }

        const absByChild = new Map();

        for (const ch of children) {
            if (!ch?.getStage?.()) continue;
            absByChild.set(ch._id, ch.getAbsoluteTransform().copy());
        }

        const sx = groupNode.scaleX();
        const sy = groupNode.scaleY();
        groupNode.scale({ x: 1, y: 1 });
        const groupAbsNoScale = groupNode.getAbsoluteTransform().copy();
        groupNode.scale({ x: sx, y: sy });

        const patch = { [groupId]: groupPatch };

        for (const ch of children) {
            if (!ch?.getStage?.()) continue;

            const childAbsVisual = absByChild.get(ch._id);
            if (!childAbsVisual) continue;

            const childLocalNew = new Transform()
                .multiply(groupAbsNoScale.copy().invert())
                .multiply(childAbsVisual);

            const attrs = childLocalNew.decompose();
            ch.setAttrs(attrs);

            const type = ch.attrs.type;
            const id = ch.attrs.id;
            const shape = getShape(type);

            if (!shape?.onTransformEnd) {
                console.warn("No onTransformEnd handler for shape type:", type);
                continue;
            }
            const res = shape.onTransformEnd(ch);
            if (type === SHAPES.group) {
                Object.assign(patch, res);
            } else {
                patch[id] = res;
            }
        }

        groupNode.scale({ x: 1, y: 1 });
        return patch;
    },
});
