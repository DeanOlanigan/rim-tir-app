import { AbsoluteCenter, Text, VStack } from "@chakra-ui/react";
import { TirLoaderIcon } from "./TirLoaderIcon";

export const Loader = ({ text, backdrop = false }) => {
    return (
        <AbsoluteCenter
            w={"full"}
            h={"full"}
            bg={backdrop ? "blackAlpha.500" : "transparent"}
            zIndex={"modal"}
        >
            <VStack textAlign={"center"}>
                <TirLoaderIcon height={"256px"} />
                <Text color={"fg.muted"} fontWeight={"medium"}>
                    {text}
                </Text>
            </VStack>
        </AbsoluteCenter>
    );
};
