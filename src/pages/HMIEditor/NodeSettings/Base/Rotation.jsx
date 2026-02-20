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
    getNodeLocalTransformMatrix,
    isHasRadius,
    round4,
} from "../../utils";
import { useNodeStore } from "../../store/node-store";

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

    // TODO сделать синхронизацию со стором
    const flipHorizontal = () => {
        const patch = {};
        ids.forEach((id) => {
            const n = useNodeStore.getState().nodes[id];
            patch[id] = flipNodeAroundCenterStore(n, "x");
        });

        applyPatch(ids, patch, true);
    };

    // TODO сделать синхронизацию со стором
    const flipVertical = () => {
        const patch = {};
        ids.forEach((id) => {
            const n = useNodeStore.getState().nodes[id];
            patch[id] = flipNodeAroundCenterStore(n, "y");
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

function normalizeScale(v, fallback = 1) {
    const n = typeof v === "number" && Number.isFinite(v) ? v : fallback;
    // если вдруг где-то оказался 0/NaN — считаем что 1, иначе "флип" бессмысленен
    if (!Number.isFinite(n) || n === 0) return fallback;
    return n;
}

function flipNodeAroundCenterStore(node, axis /* "x" | "y" */, opts = {}) {
    if (!node) return null;

    const anchor = getLocalAnchorForRotation(node, opts.size);

    const M1 = getNodeLocalTransformMatrix(node);
    const pBefore = applyToPoint(M1, anchor.x, anchor.y);

    const sx = normalizeScale(node.scaleX, 1);
    const sy = normalizeScale(node.scaleY, 1);

    const node2 = {
        ...node,
        scaleX: axis === "x" ? -sx : sx,
        scaleY: axis === "y" ? -sy : sy,
    };

    const M2 = getNodeLocalTransformMatrix(node2);
    const pAfter = applyToPoint(M2, anchor.x, anchor.y);

    const dx = pBefore.x - pAfter.x;
    const dy = pBefore.y - pAfter.y;

    return {
        x: round4((node.x ?? 0) + dx),
        y: round4((node.y ?? 0) + dy),
        rotation: round4(node.rotation ?? 0),
        skewX: node.skewX ?? 0,
        skewY: node.skewY ?? 0,
        scaleX: round4(node2.scaleX ?? 1),
        scaleY: round4(node2.scaleY ?? 1),
    };
}
