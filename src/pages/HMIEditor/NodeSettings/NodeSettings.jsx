import {
    Box,
    Flex,
    Heading,
    HStack,
    StackSeparator,
    Tabs,
    VStack,
} from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { StrokeBlock } from "./Stroke";
import { FillBlock } from "./Fill";
import { PositionBlock } from "./Position";
import { DimensionsBlock } from "./Dimensions";
import { RotationBlock } from "./Rotation";
import { OpacityBlock } from "./Opacity";
import { CornerRadiusBlock } from "./CornerRadius";
import { Layers } from "./Layers";
import { SidesBlock } from "./Sides";
import { TypographyBlock } from "./Typography";
import { ActionsBlock } from "./Actions";
import { SHAPES, SHAPES_NAMES, SHAPES_WITH_SETTINGS } from "../constants";
import { SkewBlock } from "./Skew";

export const NodeSettings = ({ api }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    if (!selectedIds.length) return null;

    const types = selectedIds.map(
        (id) => api.canvas.getNodes().get(id).attrs.type,
    );
    if (!types.every((type) => SHAPES_WITH_SETTINGS.has(type))) return null;

    return (
        <Flex
            bg={"bg"}
            w={"350px"}
            h={"100%"}
            p={"4"}
            borderRadius={"md"}
            shadow={"md"}
        >
            <Tabs.Root
                variant={"subtle"}
                defaultValue="base"
                lazyMount
                unmountOnExit
                fitted
                w={"full"}
                display={"flex"}
                flexDirection={"column"}
            >
                <Tabs.List>
                    <Tabs.Trigger value="base">Base settings</Tabs.Trigger>
                    <Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="base" display={"flex"} overflow={"hidden"}>
                    <Box overflow={"auto"}>
                        <BaseSettings
                            api={api}
                            types={types}
                            selectedIds={selectedIds}
                        />
                    </Box>
                </Tabs.Content>
                <Tabs.Content value="advanced">Advanced settings</Tabs.Content>
            </Tabs.Root>
        </Flex>
    );
};

const BaseSettings = ({ api, types, selectedIds }) => {
    const primaryNode = api.canvas.getNodes().get(selectedIds[0]);
    const isMultiple = selectedIds.length > 1;
    const heading = isMultiple
        ? `${selectedIds.length} selected`
        : SHAPES_NAMES[types[0]];

    const showCornerRadius = types.every(
        (type) => type === SHAPES.rect || type === SHAPES.polygon,
    );
    const showSides = types.every((type) => type === SHAPES.polygon);
    const showTypography = types.every((type) => type === SHAPES.text);
    const showFillStroke = types.every((type) => type !== SHAPES.group);

    return (
        <VStack
            align={"start"}
            pe={2}
            w={"100%"}
            separator={<StackSeparator borderColor={"colorPalette.solid"} />}
        >
            <HStack w={"100%"} justify={"space-between"}>
                <Heading size={"md"}>{heading}</Heading>
                <ActionsBlock ids={selectedIds} api={api} types={types} />
            </HStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Layers</Heading>
                <Layers ids={selectedIds} />
            </VStack>
            <VStack align={"start"}>
                <Heading size={"md"}>Position</Heading>
                <PositionBlock ids={selectedIds} />
                <RotationBlock ids={selectedIds} api={api} />
            </VStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Layout</Heading>
                <DimensionsBlock ids={selectedIds} api={api} />
                <SkewBlock ids={selectedIds} />
            </VStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Appearance</Heading>
                <OpacityBlock ids={selectedIds} />
                {showCornerRadius && <CornerRadiusBlock node={primaryNode} />}
                {showSides && <SidesBlock ids={selectedIds} />}
            </VStack>
            {showTypography && <TypographyBlock node={primaryNode} />}
            {showFillStroke && (
                <>
                    <FillBlock ids={selectedIds} />
                    <StrokeBlock ids={selectedIds} types={types} />
                </>
            )}
        </VStack>
    );
};
