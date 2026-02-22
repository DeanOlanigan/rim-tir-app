import { Fieldset, Flex, Group, IconButton } from "@chakra-ui/react";
import {
    LuFlipHorizontal2,
    LuFlipVertical2,
    LuRotateCwSquare,
} from "react-icons/lu";
import { RxAngle } from "react-icons/rx";
import { applyPatch, isFiniteValue, sameCheck, useNodesByIds } from "../utils";
import { LOCALE } from "../../constants";
import { CommittedNumberInput } from "../CommittedNumberInput";
import {
    applyToPoint,
    calcGroupAABBCenter,
    decomposeTRKS,
    getNodeLocalTransformMatrix,
    isHasRadius,
    mul,
    round4,
} from "../../utils";
import { useNodeStore } from "../../store/node-store";

// TODO Проверить отражения, разобраться со Scale в сторе

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
    const rotArr = useNodesByIds(ids, "rotation");
    const rSame = sameCheck(rotArr);

    const idsKey = ids.join("|");
    const uiValue =
        typeof rSame === "number" && Number.isFinite(rSame) ? rSame : null;

    const rotateTo = (angle, undoable) => {
        const patch = buildRotationPatch(ids, angle);
        applyPatch(ids, patch, undoable);
    };

    const rotateByDelta = (delta, undoable) => {
        const patch = {};
        ids.forEach((id, idx) => {
            const n = useNodeStore.getState().nodes[id];
            const curRaw = rotArr[idx];
            const cur = isFiniteValue(curRaw) ? curRaw : 0;
            const next = toDegIn0To360Range(cur + delta);
            patch[id] = rotateNodeAroundCenterStore(n, next);
        });

        applyPatch(ids, patch, undoable);
    };

    const flipHorizontal = () => {
        const nodesList = ids.map((id) => useNodeStore.getState().nodes[id]);
        const pivotWorld = calcGroupAABBCenter(nodesList);
        const patch = {};
        ids.forEach((id) => {
            const n = useNodeStore.getState().nodes[id];
            patch[id] = flipNodeAroundWorldAxis(n, "x", { pivotWorld });
        });

        applyPatch(ids, patch, true);
    };

    const flipVertical = () => {
        const nodesList = ids.map((id) => useNodeStore.getState().nodes[id]);
        const pivotWorld = calcGroupAABBCenter(nodesList);
        const patch = {};
        ids.forEach((id) => {
            const n = useNodeStore.getState().nodes[id];
            patch[id] = flipNodeAroundWorldAxis(n, "y", { pivotWorld });
        });

        applyPatch(ids, patch, true);
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
                        onScrub={(n) => rotateTo(n, false)}
                        onCommit={(n) => rotateTo(n, true)}
                    />
                    <Group attached>
                        <IconButton
                            size={"xs"}
                            variant={"outline"}
                            onClick={() => rotateByDelta(90, true)}
                        >
                            <LuRotateCwSquare />
                        </IconButton>
                        <IconButton
                            size={"xs"}
                            variant={"outline"}
                            onClick={flipHorizontal}
                            disabled
                        >
                            <LuFlipHorizontal2 />
                        </IconButton>
                        <IconButton
                            size={"xs"}
                            variant={"outline"}
                            onClick={flipVertical}
                            disabled
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
    const w = sizeOverride?.width ?? node.width ?? 0;
    const h = sizeOverride?.height ?? node.height ?? 0;

    const isEllipseLike = isHasRadius(node.type);
    const isLineLike = Array.isArray(node.points); // если у тебя есть такие ноды

    if (isEllipseLike || isLineLike) return { x: 0, y: 0 };
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
        x: round4((node.x ?? 0) + dx),
        y: round4((node.y ?? 0) + dy),
        rotation: round4(nextAngle),
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
function flipNodeAroundWorldAxis(node, axis /*"x"|"y"*/, opts = {}) {
    if (!node) return null;

    // 1) local->world
    const M1 = getNodeLocalTransformMatrix(node);

    // 2) pivot в world (можно переопределить общим pivot для выделения)
    const pivot = opts.pivotWorld ?? getWorldPivotForNode(node, opts);

    // 3) отражение в world
    const F =
        axis === "x"
            ? { a: -1, b: 0, c: 0, d: 1, e: 2 * pivot.x, f: 0 } // Flip Horizontal
            : { a: 1, b: 0, c: 0, d: -1, e: 0, f: 2 * pivot.y }; // Flip Vertical

    // 4) новое local->world после отражения (ВАЖНО: слева)
    const M2 = mul(F, M1);

    // 5) обратно в TRKS (в твоём порядке T*R*K*S)
    const dec = decomposeTRKS(M2);

    // 6) поправка ellipse-like: у тебя в матрице T(x+w/2, y+h/2),
    // а в сторе x/y = top-left bbox
    let xStore = dec.x;
    let yStore = dec.y;

    if (isHasRadius(node.type)) {
        const w = node.width ?? 0;
        const h = node.height ?? 0;
        xStore = dec.x - w / 2;
        yStore = dec.y - h / 2;
    }

    return {
        x: round4(xStore),
        y: round4(yStore),
        rotation: round4(dec.rotation ?? 0),
        skewX: round4(dec.skewX ?? 0),
        skewY: round4(dec.skewY ?? 0),
        scaleX: round4(dec.scaleX ?? 1),
        scaleY: round4(dec.scaleY ?? 1),
    };
}
