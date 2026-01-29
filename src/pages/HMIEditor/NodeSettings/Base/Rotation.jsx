import {
    Fieldset,
    Flex,
    Group,
    IconButton,
    InputGroup,
    NumberInput,
} from "@chakra-ui/react";
import {
    LuFlipHorizontal2,
    LuFlipVertical2,
    LuRotateCwSquare,
} from "react-icons/lu";
import { RxAngle } from "react-icons/rx";
import { sameCheck, useNodesByIds } from "../utils";
import { rotateNodeAroundCenter } from "../../canvas/services/shapeTransforms";
import { patchStoreRaf } from "../../store/node-store";

function toDegIn0To360Range(deg) {
    return ((deg % 360) + 360) % 360;
}

export const RotationBlock = ({ ids, api }) => {
    const rot = useNodesByIds(ids, "rotation");
    const r = sameCheck(rot);

    const handleRotation = (angle) => {
        const val = Number.isNaN(angle) ? 0 : angle;
        const next = toDegIn0To360Range(val);
        const patch = {};
        ids.forEach((id) => {
            patch[id] = rotateNodeAroundCenter(api, id, next);
        });

        patchStoreRaf(ids, patch);
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
            <Fieldset.Legend>Rotation</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Flex justify={"space-between"}>
                    <NumberInput.Root
                        size={"xs"}
                        value={r}
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
                            onClick={() => handleRotation(r + 90)}
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
