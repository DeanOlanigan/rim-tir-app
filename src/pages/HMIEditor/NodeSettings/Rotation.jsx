import {
    Fieldset,
    Flex,
    Group,
    IconButton,
    InputGroup,
    NumberInput,
} from "@chakra-ui/react";
import { useState } from "react";
import {
    LuFlipHorizontal2,
    LuFlipVertical2,
    LuRotateCwSquare,
} from "react-icons/lu";
import { RxAngle } from "react-icons/rx";
import { patchNodeThrottled } from "./utils";
import { round4 } from "../utils";

function toDegIn0To360Range(deg) {
    return ((deg % 360) + 360) % 360;
}

function applyCenteredTransform(node, transformFn) {
    const stage = node.getStage();
    if (!stage) return;

    // центр до трансформации
    const oldRect = node.getClientRect({ relativeTo: stage });
    const oldCenter = {
        x: oldRect.x + oldRect.width / 2,
        y: oldRect.y + oldRect.height / 2,
    };

    // сама трансформация (rotation / flip / что угодно)
    transformFn();

    // центр после трансформации
    const newRect = node.getClientRect({ relativeTo: stage });
    const newCenter = {
        x: newRect.x + newRect.width / 2,
        y: newRect.y + newRect.height / 2,
    };

    // сдвигаем ноду так, чтобы визуальный центр остался на месте
    const dx = oldCenter.x - newCenter.x;
    const dy = oldCenter.y - newCenter.y;

    const newPosX = round4(node.x() + dx);
    const newPosY = round4(node.y() + dy);

    node.position({
        x: newPosX,
        y: newPosY,
    });

    return { x: newPosX, y: newPosY };
}

export const RotationBlock = ({ node }) => {
    const [value, setValue] = useState(node.rotation());

    const handleRotation = (angle) => {
        const val = Number.isNaN(angle) ? 0 : angle;
        const next = toDegIn0To360Range(val);

        const { x, y } = applyCenteredTransform(node, () => {
            node.rotation(next);
        });
        setValue(next);
        patchNodeThrottled(node.id(), { x, y, rotation: next });
    };

    // TODO сделать синхронизацию со стором
    const flipHorizontal = () => {
        applyCenteredTransform(node, () => {
            node.scaleX(node.scaleX() * -1);
        });
        // rotation не меняется, input остаётся с тем же value
    };

    // TODO сделать синхронизацию со стором
    const flipVertical = () => {
        applyCenteredTransform(node, () => {
            node.scaleY(node.scaleY() * -1);
        });
        // rotation тоже без изменений
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Rotation</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Flex justify={"space-between"}>
                    <NumberInput.Root
                        size={"xs"}
                        allowOverflow={false}
                        value={value}
                        onValueChange={(e) => handleRotation(e.valueAsNumber)}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>
                                    <RxAngle />
                                </NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <Group attached>
                        <IconButton
                            size={"xs"}
                            variant={"outline"}
                            onClick={() => handleRotation(value + 90)}
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
