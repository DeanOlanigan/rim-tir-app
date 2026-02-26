import { Heading, HStack, VStack } from "@chakra-ui/react";
import { DashBlock } from "./DashBlock";
import { StrokeColorSolidBlock } from "./StrokeColorSolidBlock";
import { StrokeWeightBlock } from "./StrokeWeightBlock";
import { LineJoinBlock } from "./LineJoinBlock";
import { LineCapBlock } from "./LineCapBlock";
import { CloseBlock } from "./CloseBlock";
import { TensionBlock } from "./TensionBlock";
import { isLineLikeType } from "@/pages/HMIEditor/utils";
import { LOCALE, SHAPES } from "@/pages/HMIEditor/constants";

export const StrokeBlock = ({ ids, types }) => {
    const isMultiple = ids.length > 1;
    const showLineSpecifics =
        !isMultiple && types.every((type) => isLineLikeType(type));
    const showClose =
        !isMultiple && types.every((type) => type === SHAPES.line);

    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"md"}>{LOCALE.stroke}</Heading>
            <StrokeColorSolidBlock ids={ids} />
            <StrokeWeightBlock ids={ids} />
            <DashBlock ids={ids} />
            <HStack w={"100%"} justify={"space-between"}>
                <LineJoinBlock ids={ids} />
                <LineCapBlock ids={ids} />
            </HStack>
            {showLineSpecifics && <TensionBlock ids={ids} />}
            {showClose && <CloseBlock ids={ids} />}
        </VStack>
    );
};
