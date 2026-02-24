import { Heading, StackSeparator, VStack } from "@chakra-ui/react";
import { LOCALE, SHAPES } from "../../constants";
import { Layers } from "./Layers";
import { PositionBlock } from "./Position";
import { RotationBlock } from "./Rotation";
import { DimensionsBlock } from "./Dimensions";
import { OpacityBlock } from "./Opacity";
import { CornerRadiusBlock } from "./CornerRadius";
import { SidesBlock } from "./Sides";
import { TypographyBlock } from "./Typography";
import { FillBlock } from "./Fill";
import { StrokeBlock } from "./Stroke";
import { Align } from "./Align";

export const BaseSettings = ({ types, selectedIds }) => {
    const showCornerRadius = types.every(
        (type) => type === SHAPES.rect || type === SHAPES.polygon,
    );
    const showSides = types.every((type) => type === SHAPES.polygon);
    const showTypography = types.every((type) => type === SHAPES.text);
    const showFillStroke = types.every((type) => type !== SHAPES.group);
    const showAlign =
        types.every((type) => type === SHAPES.group) || selectedIds.length > 1;

    return (
        <VStack
            align={"start"}
            p={2}
            w={"100%"}
            separator={<StackSeparator borderColor={"colorPalette.solid"} />}
        >
            {showAlign && (
                <VStack align={"start"} w={"100%"}>
                    <Heading size={"md"}>Выравнивание</Heading>
                    <Align ids={selectedIds} />
                </VStack>
            )}
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>{LOCALE.layers}</Heading>
                <Layers ids={selectedIds} />
            </VStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>{LOCALE.position}</Heading>
                <PositionBlock ids={selectedIds} />
                <RotationBlock ids={selectedIds} />
            </VStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>{LOCALE.layout}</Heading>
                <DimensionsBlock ids={selectedIds} />
            </VStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>{LOCALE.appearance}</Heading>
                <OpacityBlock ids={selectedIds} />
                {showCornerRadius && (
                    <CornerRadiusBlock ids={selectedIds} types={types} />
                )}
                {showSides && <SidesBlock ids={selectedIds} />}
            </VStack>
            {showTypography && <TypographyBlock ids={selectedIds} />}
            {showFillStroke && (
                <>
                    <FillBlock ids={selectedIds} />
                    <StrokeBlock ids={selectedIds} types={types} />
                </>
            )}
        </VStack>
    );
};
