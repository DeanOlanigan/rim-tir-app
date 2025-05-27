import { Text, Stack, StackSeparator } from "@chakra-ui/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfigInfoStore } from "@/store/config-info-store";

export const ConfMiscInfo = () => {
    const { name, date, version } = useConfigInfoStore(
        (state) => state.configInfo
    );

    return (
        <Stack direction={"row"} gap={"2"} separator={<StackSeparator />}>
            {name ? (
                <Text fontSize={"sm"}>{name}</Text>
            ) : (
                <Skeleton w={"200px"} h={"24px"} />
            )}
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
