import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { LuDot } from "react-icons/lu";

export const ErrorMessages = ({ errors }) => {
    if (!errors) return null;

    return (
        <Box>
            {Array.from(errors).map(([param, validators]) =>
                Array.from(validators).map(([validator, error]) =>
                    error.messages.map((message, i) => (
                        <Flex key={`${error.id}:${param}:${validator}:${i}`}>
                            <Icon size={"md"} as={LuDot} />
                            <Text>{message}</Text>
                        </Flex>
                    ))
                )
            )}
        </Box>
    );
};
