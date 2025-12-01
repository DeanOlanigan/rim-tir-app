import {
    Box,
    Flex,
    Heading,
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

const SHAPES_WITH_SETTINGS = new Set([
    "rect",
    "polygon",
    "ellipse",
    "text",
    "line",
    "arrow",
]);

const SHAPES_NAMES = {
    rect: "Rectangle",
    polygon: "Polygon",
    ellipse: "Ellipse",
    text: "Text",
    line: "Line",
    arrow: "Arrow",
};

export const NodeSettings = ({ nodesRef }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    if (!selectedIds.length) return null;
    const node = nodesRef.current.get(selectedIds[0]);
    if (!node) return null;
    const type = node.attrs.type;

    if (selectedIds.length !== 1 || !SHAPES_WITH_SETTINGS.has(type))
        return null;

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
                        />
                    </Box>
                </Tabs.Content>
                <Tabs.Content value="advanced">Advanced settings</Tabs.Content>
            </Tabs.Root>
        </Flex>
    );
};

const BaseSettings = ({ nodesRef, selectedIds }) => {
    const primaryNode = nodesRef.current.get(selectedIds[0]);
    const type = primaryNode.attrs.type;
    const heading =
        selectedIds.length > 1
            ? `${selectedIds.length} selected`
            : SHAPES_NAMES[primaryNode.attrs.type];
    return (
        <VStack
            pe={2}
            w={"100%"}
            separator={<StackSeparator borderColor={"colorPalette.solid"} />}
        >
            <VStack align={"start"}>
                <Heading size={"md"}>{heading}</Heading>
                <PositionBlock node={primaryNode} />
                <DimensionsBlock node={primaryNode} />
                <RotationBlock node={primaryNode} />
            </VStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Appearance</Heading>
                <OpacityBlock node={primaryNode} />
                {(type === "rect" || type === "polygon") && (
                    <CornerRadiusBlock node={primaryNode} />
                )}
                {type === "polygon" && <SidesBlock node={primaryNode} />}
            </VStack>
            <FillBlock node={primaryNode} />
            <StrokeBlock node={primaryNode} />
            <Layers node={primaryNode} />
        </VStack>
    );
};
