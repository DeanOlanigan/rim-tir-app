import { Fieldset, Flex, Group, IconButton } from "@chakra-ui/react";
import {
    LuFlipHorizontal2,
    LuFlipVertical2,
    LuRotateCwSquare,
} from "react-icons/lu";
import { RxAngle } from "react-icons/rx";
import { applyPatch, isFiniteValue, sameCheck, useNodesByIds } from "../utils";
import { rotateNodeAroundCenter } from "../../canvas/services/shapeTransforms";
import { LOCALE } from "../../constants";
import { CommittedNumberInput } from "../CommittedNumberInput";

function toDegIn0To360Range(deg) {
    return ((deg % 360) + 360) % 360;
}

function buildRotationPatch(ids, api, angle) {
    const val = Number.isNaN(angle) ? 0 : angle;
    const next = toDegIn0To360Range(val);

    const patch = {};
    ids.forEach((id) => {
        patch[id] = rotateNodeAroundCenter(api, id, next);
    });

    return patch;
}

export const RotationBlock = ({ ids, api }) => {
    const rotArr = useNodesByIds(ids, "rotation");
    const rSame = sameCheck(rotArr);

    const idsKey = ids.join("|");
    const uiValue =
        typeof rSame === "number" && Number.isFinite(rSame) ? rSame : null;

    const rotateTo = (angle, undoable) => {
        const patch = buildRotationPatch(ids, api, angle);
        applyPatch(ids, patch, undoable);
    };

    const rotateByDelta = (delta, undoable) => {
        const patch = {};
        ids.forEach((id, idx) => {
            const curRaw = rotArr[idx];
            const cur = isFiniteValue(curRaw) ? curRaw : 0;
            const next = toDegIn0To360Range(cur + delta);
            patch[id] = rotateNodeAroundCenter(api, id, next);
        });

        applyPatch(ids, patch, undoable);
    };

    // TODO сделать синхронизацию со стором
    const flipHorizontal = () => {
        /* applyCenteredTransform(node, () => {
            node.scaleX(node.scaleX() * -1);
        }); */
        // rotation не меняется, input остаётся с тем же value
    };

    // TODO сделать синхронизацию со стором
    const flipVertical = () => {
        /* applyCenteredTransform(node, () => {
            node.scaleY(node.scaleY() * -1);
        }); */
        // rotation тоже без изменений
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
                        min={0}
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
