import { Text, Stack, StackSeparator } from "@chakra-ui/react";

export const ConfMiscInfo = ({ date, version }) => {
    return (
        <Stack direction={"row"} gap={"2"} separator={<StackSeparator />}>
            <Text fontSize={"sm"}>{date}</Text>
            <Text fontSize={"sm"}>{version}</Text>
        </Stack>
    );
};
