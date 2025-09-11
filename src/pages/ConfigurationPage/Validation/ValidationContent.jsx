import { Flex, StackSeparator, VStack } from "@chakra-ui/react";
import { RedirectButton } from "./RedirectButton";
import { ErrorMessages } from "./ErrorMessages";

export const ValidationContent = ({ errors }) => {
    return (
        <Flex
            direction={"column"}
            gap={"2"}
            p={"2"}
            maxH={"200px"}
            minW={"500px"}
            overflow={"auto"}
        >
            {Array.from(errors.entries()).map(([nodeId, params]) => (
                <VStack
                    key={nodeId}
                    w={"100%"}
                    align={"start"}
                    separator={<StackSeparator borderColor={"border.error"} />}
                >
                    <RedirectButton id={nodeId} />
                    <ErrorMessages errors={params} />
                </VStack>
            ))}
        </Flex>
    );
};
