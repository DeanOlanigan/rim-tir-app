import { Box, Flex, Heading, Tabs, VStack } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { StrokeBlock } from "./Stroke";
import { FillBlock } from "./Fill";
import { PositionBlock } from "./Position";
import { DimensionsBlock } from "./Dimensions";
import { RotationBlock } from "./Rotation";
import { OpacityBlock } from "./Opacity";
import { CornerRadiusBlock } from "./CornerRadius";
import { Layers } from "./Layers";

const SHAPES_WITH_SETTINGS = new Set(["rect", "ellipse", "line", "arrow"]);

const SHAPES_NAMES = {
    rect: "Rectangle",
    ellipse: "Ellipse",
    line: "Line",
    arrow: "Arrow",
};

export const NodeSettings = ({ canvasRef }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const nodes = useNodeStore((state) => state.nodes);

    if (
        selectedIds.length !== 1 ||
        !SHAPES_WITH_SETTINGS.has(
            nodes.find((n) => n.id === selectedIds[0]).type
        )
    )
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
                            canvasRef={canvasRef}
                            selectedIds={selectedIds}
                            nodes={nodes}
                        />
                    </Box>
                </Tabs.Content>
                <Tabs.Content value="advanced">Advanced settings</Tabs.Content>
            </Tabs.Root>
        </Flex>
    );
};

const BaseSettings = ({ canvasRef, selectedIds }) => {
    const primaryNode = canvasRef.current.findOne(`#${selectedIds[0]}`);
    const type = primaryNode.attrs.type;
    const heading =
        selectedIds.length > 1
            ? `${selectedIds.length} selected`
            : SHAPES_NAMES[primaryNode.attrs.type];
    return (
        <VStack pe={2} w={"100%"}>
            <VStack align={"start"}>
                <Heading size={"md"}>{heading}</Heading>
                <PositionBlock node={primaryNode} />
                <DimensionsBlock node={primaryNode} />
                <RotationBlock node={primaryNode} />
            </VStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Appearance</Heading>
                <OpacityBlock node={primaryNode} />
                {type === "rect" && <CornerRadiusBlock node={primaryNode} />}
            </VStack>
            <FillBlock node={primaryNode} />
            <StrokeBlock node={primaryNode} />
            <Layers node={primaryNode} />
        </VStack>
    );
};
