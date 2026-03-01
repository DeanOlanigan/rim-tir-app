import { Fieldset, Flex, Group, IconButton } from "@chakra-ui/react";
import {
    LuFlipHorizontal2,
    LuFlipVertical2,
    LuRotateCwSquare,
} from "react-icons/lu";
import { RxAngle } from "react-icons/rx";
import {
    applyPatch,
    isFiniteValue,
    sameCheck,
    useEffectiveParamsByIds,
} from "../utils";
import { LOCALE } from "../../constants";
import { CommittedNumberInput } from "../CommittedNumberInput";
import {
    applyToPoint,
    calcGroupAABBCenter,
    decomposeTRKS,
    getNodeLocalTransformMatrix,
    isHasRadius,
    isLineLikeType,
    mul,
} from "../../utils";
import { useNodeStore } from "../../store/node-store";
import { patchStoreRaf } from "../../store/patchStoreRaf";
import { useInteractiveStore } from "../../store/interactive-store";
import { getNodeLocalBounds } from "../../store/utils/geometry";

function toDegIn0To360Range(deg) {
    return ((deg % 360) + 360) % 360;
}

function buildRotationPatch(ids, angle) {
    const val = Number.isNaN(angle) ? 0 : angle;
    const next = toDegIn0To360Range(val);

    const patch = {};
    ids.forEach((id) => {
        const n = useNodeStore.getState().nodes[id];
        patch[id] = rotateNodeAroundCenterStore(n, next);
    });

    return patch;
}

export const RotationBlock = ({ ids }) => {
    const rotArr = useEffectiveParamsByIds(ids, "rotation");
    const rSame = sameCheck(rotArr);

    const idsKey = ids.join("|");
    const uiValue =
        typeof rSame === "number" && Number.isFinite(rSame) ? rSame : null;

    const rotateTo = (angle, undoable) => {
        const patch = buildRotationPatch(ids, angle);
        applyPatch(patch, undoable);
    };

    const finalizeInteractiveIfAny = () => {
        patchStoreRaf.cancel();
        const int = useInteractiveStore.getState();
        int.cancel();
    };

    const rotateByDelta = (delta) => {
        finalizeInteractiveIfAny();

        const nodes = useNodeStore.getState().nodes;
        const patch = {};

        ids.forEach((id, idx) => {
            const n = nodes[id];
            if (!n) return;
            const curRaw = rotArr[idx];
            const cur = isFiniteValue(curRaw) ? curRaw : 0;
            const next = toDegIn0To360Range(cur + delta);
            patch[id] = rotateNodeAroundCenterStore(n, next);
        });

        useNodeStore.getState().updateNodes(patch);
    };

    const flipHorizontal = () => {
        finalizeInteractiveIfAny();

        const nodes = useNodeStore.getState().nodes;
        const nodesList = ids.map((id) => nodes[id]).filter(Boolean);
        const pivotWorld = calcGroupAABBCenter(nodesList);
        const patch = {};
        ids.forEach((id) => {
            const n = nodes[id];
            if (!n) return;
            patch[id] = flipNodeAroundWorldAxis(n, "y", { pivotWorld });
        });

        useNodeStore.getState().updateNodes(patch);
    };

    const flipVertical = () => {
        finalizeInteractiveIfAny();
        const nodes = useNodeStore.getState().nodes;
        const nodesList = ids.map((id) => nodes[id]).filter(Boolean);
        const pivotWorld = calcGroupAABBCenter(nodesList);
        const patch = {};
        ids.forEach((id) => {
            const n = nodes[id];
            if (!n) return;
            patch[id] = flipNodeAroundWorldAxis(n, "x", { pivotWorld });
        });

        useNodeStore.getState().updateNodes(patch);
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>{LOCALE.rotation}</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Flex justify={"space-between"}>
                    <CommittedNumberInput
                        key={`rot:${idsKey}`}
                        uiValue={uiValue}
                        label={<RxAngle />}
                        placeholder={LOCALE.mixed}
                        step={1}
                        min={-360}
                        max={360}
                        onScrubStart={() =>
                            useInteractiveStore.getState().begin()
                        }
                        onScrub={(n) => rotateTo(n, false)}
                        onCommit={(n) => rotateTo(n, true)}
                    />
                    <Group attached>
                        <IconButton
                            size={"xs"}
                            variant={"outline"}
                            onClick={() => rotateByDelta(90)}
                        >
                            <LuRotateCwSquare />
                        </IconButton>
                        <IconButton
                            size={"xs"}
                            variant={"outline"}
                            onClick={flipHorizontal}
                        >
                            <LuFlipHorizontal2 />
                        </IconButton>
                        <IconButton
                            size={"xs"}
                            variant={"outline"}
                            onClick={flipVertical}
                        >
                            <LuFlipVertical2 />
                        </IconButton>
                    </Group>
                </Flex>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};

function getLocalAnchorForRotation(node, sizeOverride) {
    const isEllipseLike = isHasRadius(node.type);
    if (isEllipseLike) return { x: 0, y: 0 };

    if (isLineLikeType(node.type)) {
        const b = getNodeLocalBounds(node);
        return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }

    const w = sizeOverride?.width ?? node.width ?? 0;
    const h = sizeOverride?.height ?? node.height ?? 0;

    return { x: w / 2, y: h / 2 };
}

function rotateNodeAroundCenterStore(node, nextAngle, opts = {}) {
    if (!node) return null;

    const anchor = getLocalAnchorForRotation(node, opts.size);

    const M1 = getNodeLocalTransformMatrix(node);
    const pBefore = applyToPoint(M1, anchor.x, anchor.y);

    const node2 = { ...node, rotation: nextAngle };
    const M2 = getNodeLocalTransformMatrix(node2);
    const pAfter = applyToPoint(M2, anchor.x, anchor.y);

    const dx = pBefore.x - pAfter.x;
    const dy = pBefore.y - pAfter.y;

    return {
        x: (node.x ?? 0) + dx,
        y: (node.y ?? 0) + dy,
        rotation: nextAngle,
        // если в модели уже есть skew/scale — оставляем как есть (не трогаем)
        skewX: node.skewX ?? 0,
        skewY: node.skewY ?? 0,
        scaleX: node.scaleX ?? 1,
        scaleY: node.scaleY ?? 1,
    };
}

function getWorldPivotForNode(node, opts = {}) {
    const anchor = getLocalAnchorForRotation(node, opts.size); // твоя функция
    const M = getNodeLocalTransformMatrix(node);
    return applyToPoint(M, anchor.x, anchor.y);
}

/**
 * axis:
 *  - "x" => Flip Horizontal (mirror по мировому X: отражаем относительно вертикальной линии)
 *  - "y" => Flip Vertical   (mirror по мировому Y: отражаем относительно горизонтальной линии)
 */
function flipNodeAroundWorldAxisRaw(node, axis, opts = {}) {
    if (!node) return null;

    const M1 = getNodeLocalTransformMatrix(node);
    const pivot = opts.pivotWorld ?? getWorldPivotForNode(node, opts);

    const F =
        axis === "x"
            ? { a: -1, b: 0, c: 0, d: 1, e: 2 * pivot.x, f: 0 }
            : { a: 1, b: 0, c: 0, d: -1, e: 0, f: 2 * pivot.y };

    const M2 = mul(F, M1);
    const dec = decomposeTRKS(M2);

    return { M2, dec, pivot };
}

function flipNodeAroundWorldAxis(node, axis, opts = {}) {
    const raw = flipNodeAroundWorldAxisRaw(node, axis, opts);
    if (!raw) return null;

    if (isLineLikeType(node.type)) {
        return canonicalizeLineLikeFromMatrix(node, raw.M2);
    }

    if (isHasRadius(node.type)) {
        return canonicalizeEllipseLikeFromMatrix(node, raw.M2);
    }

    return canonicalizeRectLikeFromMatrix(node, raw.M2);
}

function cleanNumber(v, eps = 1e-10) {
    if (Math.abs(v) < eps) return 0;
    return v;
}

function canonicalizeRectLikeFromMatrix(node, M2) {
    const w = node.width ?? 0;
    const h = node.height ?? 0;

    // Берем decomposition только чтобы понять,
    // какие локальные оси были отражены
    const dec = decomposeTRKS(M2);
    const sx = dec.scaleX ?? 1;
    const sy = dec.scaleY ?? 1;

    const width = w * Math.abs(sx);
    const height = h * Math.abs(sy);

    // Выбираем локальный origin и соседей
    const ox = sx < 0 ? w : 0;
    const oy = sy < 0 ? h : 0;

    const O = applyToPoint(M2, ox, oy);

    return {
        x: cleanNumber(O.x),
        y: cleanNumber(O.y),
        width: cleanNumber(width),
        height: cleanNumber(height),
        rotation: cleanNumber(dec.rotation ?? 0),
        skewX: cleanNumber(dec.skewX ?? 0),
        skewY: cleanNumber(dec.skewY ?? 0),
        scaleX: 1,
        scaleY: 1,
    };
}

function canonicalizeEllipseLikeFromMatrix(node, M2) {
    const w = node.width ?? 0;
    const h = node.height ?? 0;

    const dec = decomposeTRKS(M2);

    const sx = dec.scaleX ?? 1;
    const sy = dec.scaleY ?? 1;

    const width = w * Math.abs(sx);
    const height = h * Math.abs(sy);

    const C = applyToPoint(M2, 0, 0); // center

    return {
        x: cleanNumber(C.x - width / 2),
        y: cleanNumber(C.y - height / 2),
        width: cleanNumber(width),
        height: cleanNumber(height),
        rotation: cleanNumber(dec.rotation ?? 0),
        skewX: cleanNumber(dec.skewX ?? 0),
        skewY: cleanNumber(dec.skewY ?? 0),
        scaleX: 1,
        scaleY: 1,
    };
}

function cleanPoints(points, eps = 1e-10) {
    return points.map((v) => cleanNumber(v, eps));
}

function canonicalizeLineLikeFromMatrix(node, M2) {
    const pts = node.points ?? [0, 0];
    if (pts.length < 2) {
        const O = applyToPoint(M2, 0, 0);
        return {
            x: cleanNumber(O.x),
            y: cleanNumber(O.y),
            points: [0, 0],
            rotation: 0,
            skewX: 0,
            skewY: 0,
            scaleX: 1,
            scaleY: 1,
        };
    }

    // Трансформируем все точки линии в world
    const worldPts = [];
    for (let i = 0; i < pts.length; i += 2) {
        const W = applyToPoint(M2, pts[i], pts[i + 1]);
        worldPts.push(cleanNumber(W.x), cleanNumber(W.y));
    }

    // Первая точка становится новой позицией узла
    const ox = worldPts[0];
    const oy = worldPts[1];

    // points храним относительно первой точки
    const newPoints = [];
    for (let i = 0; i < worldPts.length; i += 2) {
        newPoints.push(
            cleanNumber(worldPts[i] - ox),
            cleanNumber(worldPts[i + 1] - oy),
        );
    }

    // Жестко соблюдаем инвариант модели
    newPoints[0] = 0;
    newPoints[1] = 0;

    return {
        x: ox,
        y: oy,
        points: cleanPoints(newPoints),
        rotation: 0,
        skewX: 0,
        skewY: 0,
        scaleX: 1,
        scaleY: 1,
    };
}
