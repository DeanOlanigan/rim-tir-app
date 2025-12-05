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

export const NodeSettings = ({ nodesRef, transformerRef }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    if (!selectedIds.length) return null;

    const types = selectedIds.map((id) => nodesRef.current.get(id).attrs.type);
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
                            nodesRef={nodesRef}
                            selectedIds={selectedIds}
                            transformerRef={transformerRef}
                        />
                    </Box>
                </Tabs.Content>
                <Tabs.Content value="advanced">Advanced settings</Tabs.Content>
            </Tabs.Root>
        </Flex>
    );
};

const BaseSettings = ({ nodesRef, selectedIds, transformerRef }) => {
    const primaryNode = nodesRef.current.get(selectedIds[0]);
    const type = primaryNode.attrs.type;
    const isMultiple = selectedIds.length > 1;
    const heading = isMultiple
        ? `${selectedIds.length} selected`
        : SHAPES_NAMES[primaryNode.attrs.type];

    const showCornerRadius =
        !isMultiple && (type === SHAPES.rect || type === SHAPES.polygon);
    const showSides = !isMultiple && type === SHAPES.polygon;
    const showTypography = !isMultiple && type === SHAPES.text;
    const showFillStroke = !isMultiple && type !== SHAPES.group;

    return (
        <VStack
            align={"start"}
            pe={2}
            w={"100%"}
            separator={<StackSeparator borderColor={"colorPalette.solid"} />}
        >
            <HStack w={"100%"} justify={"space-between"}>
                <Heading size={"md"}>{heading}</Heading>
                <ActionsBlock
                    node={primaryNode}
                    nodesRef={nodesRef}
                    selectedIds={selectedIds}
                    transformerRef={transformerRef}
                />
            </HStack>
            <VStack align={"start"}>
                <Heading size={"md"}>Position</Heading>
                <PositionBlock node={primaryNode} />
                <RotationBlock node={primaryNode} />
            </VStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Layout</Heading>
                <DimensionsBlock
                    node={primaryNode}
                    nodesRef={nodesRef}
                    selectedIds={selectedIds}
                />
            </VStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Appearance</Heading>
                <OpacityBlock node={primaryNode} />
                {showCornerRadius && <CornerRadiusBlock node={primaryNode} />}
                {showSides && <SidesBlock node={primaryNode} />}
            </VStack>
            {showTypography && <TypographyBlock node={primaryNode} />}
            {showFillStroke && (
                <>
                    <FillBlock node={primaryNode} />
                    <StrokeBlock node={primaryNode} />
                </>
            )}
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Layers</Heading>
                <Layers node={primaryNode} />
            </VStack>
        </VStack>
    );
};
