import { Heading, HStack, VStack } from "@chakra-ui/react";
import { DashBlock } from "./DashBlock";
import { StrokeColorSolidBlock } from "./StrokeColorSolidBlock";
import { StrokeWeightBlock } from "./StrokeWeightBlock";
import { LineJoinBlock } from "./LineJoinBlock";
import { LineCapBlock } from "./LineCapBlock";
import { CloseBlock } from "./CloseBlock";
import { BezierBlock } from "./BezierBlock";
import { TensionBlock } from "./TensionBlock";
import { isLineLikeType } from "@/pages/HMIEditor/utils";

export const StrokeBlock = ({ ids, types }) => {
    const isMultiple = ids.length > 1;
    const showLineSpecifics =
        !isMultiple && types.every((type) => isLineLikeType(type));

    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"md"}>Stroke</Heading>
            <StrokeColorSolidBlock ids={ids} />
            <StrokeWeightBlock ids={ids} />
            <HStack w={"100%"} justify={"space-between"}>
                <LineJoinBlock ids={ids} />
                <LineCapBlock ids={ids} />
            </HStack>
            <DashBlock ids={ids} />
            {showLineSpecifics && (
                <HStack justify={"space-between"} w={"100%"}>
                    <TensionBlock ids={ids} />
                    <VStack>
                        <CloseBlock ids={ids} />
                        <BezierBlock ids={ids} />
                    </VStack>
                </HStack>
            )}
        </VStack>
    );
};
