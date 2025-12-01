import { Heading, HStack, VStack } from "@chakra-ui/react";
import { DashBlock } from "./DashBlock";
import { StrokeColorSolidBlock } from "./StrokeColorSolidBlock";
import { StrokeWeightBlock } from "./StrokeWeightBlock";
import { LineJoinBlock } from "./LineJoinBlock";
import { LineCapBlock } from "./LineCapBlock";
import { CloseBlock } from "./CloseBlock";
import { BezierBlock } from "./BezierBlock";
import { TensionBlock } from "./TensionBlock";

export const StrokeBlock = ({ node }) => {
    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"md"}>Stroke</Heading>
            <StrokeColorSolidBlock node={node} />
            <StrokeWeightBlock node={node} />
            <HStack w={"100%"} justify={"space-between"}>
                <LineJoinBlock node={node} />
                <LineCapBlock node={node} />
            </HStack>
            <DashBlock node={node} />
            {(node.attrs.type === "line" || node.attrs.type === "arrow") && (
                <HStack justify={"space-between"} w={"100%"}>
                    <TensionBlock node={node} />
                    <VStack>
                        <CloseBlock node={node} />
                        <BezierBlock node={node} />
                    </VStack>
                </HStack>
            )}
        </VStack>
    );
};
