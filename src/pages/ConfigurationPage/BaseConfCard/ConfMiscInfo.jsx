import { Text, Stack, StackSeparator } from "@chakra-ui/react";
import { Skeleton } from "../../../components/ui/skeleton";

export const ConfMiscInfo = ({ date, version }) => {
    return (
        <Stack direction={"row"} gap={"2"} separator={<StackSeparator />}>
            {date ? (
                <Text fontSize={"sm"}>{date}</Text>
            ) : (
                <Skeleton w={"100px"} h={"24px"} />
            )}
            {version ? (
                <Text fontSize={"sm"}>{version}</Text>
            ) : (
                <Skeleton w={"40px"} h={"24px"} />
            )}
        </Stack>
    );
};
