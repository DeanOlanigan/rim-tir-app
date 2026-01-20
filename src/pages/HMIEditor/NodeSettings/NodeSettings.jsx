import {
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
import { AdvancedSettings } from "./Advanced/AdvancedSettings";

export const NodeSettings = ({ api }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    if (!selectedIds.length) return null;

    const types = selectedIds.map(
        (id) => api.canvas.getNodes().get(id).attrs.type,
    );
    if (!types.every((type) => SHAPES_WITH_SETTINGS.has(type))) return null;

    const isMultiple = selectedIds.length > 1;

    const heading = isMultiple
        ? `${selectedIds.length} selected`
        : SHAPES_NAMES[types[0]];

    return (
        <Flex
            bg={"bg"}
            w={"400px"}
            h={"100%"}
            p={2}
            borderRadius={"md"}
            shadow={"md"}
            direction={"column"}
            gap={2}
        >
            <HStack w={"100%"} justify={"space-between"}>
                <Heading size={"md"}>{heading}</Heading>
                <ActionsBlock ids={selectedIds} api={api} types={types} />
            </HStack>
            <Tabs.Root
                variant={"line"}
                defaultValue="base"
                lazyMount
                unmountOnExit
                fitted
                w={"100%"}
                h={"100%"}
                display={"flex"}
                flexDirection={"column"}
                overflow={"hidden"}
                size={"sm"}
            >
                <Tabs.List>
                    <Tabs.Trigger value="base">Base settings</Tabs.Trigger>
                    <Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="base" h={"100%"} overflow={"auto"}>
                    <BaseSettings
                        api={api}
                        types={types}
                        selectedIds={selectedIds}
                    />
                </Tabs.Content>
                <Tabs.Content value="advanced" flex={1} overflow={"hidden"}>
                    <AdvancedSettings
                        api={api}
                        types={types}
                        selectedIds={selectedIds}
                    />
                </Tabs.Content>
            </Tabs.Root>
        </Flex>
    );
};

const BaseSettings = ({ api, types, selectedIds }) => {
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
