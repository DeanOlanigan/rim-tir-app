import { getConfiguration } from "@/api/configuration";
import { QK } from "@/api/queryKeys";
import {
    Box,
    Flex,
    IconButton,
    Popover,
    Portal,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LuInfo } from "react-icons/lu";

export const ConfigInfo = () => {
    const { data: config } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ configInfo }) => configInfo,
    });

    return (
        <Flex gap={"1"}>
            <Text fontWeight={"medium"}>{config?.name}</Text>
            <Popover.Root size={"sm"} lazyMount unmountOnExit>
                <Popover.Trigger asChild>
                    <IconButton
                        size={"2xs"}
                        variant={"ghost"}
                        rounded={"full"}
                        colorPalette={"blue"}
                    >
                        <LuInfo />
                    </IconButton>
                </Popover.Trigger>
                <Portal>
                    <Popover.Positioner>
                        <Popover.Content>
                            <Popover.Body asChild>
                                <Stack>
                                    <Box>
                                        <Text fontWeight={"medium"}>
                                            Описание
                                        </Text>
                                        <Text lineClamp={3}>
                                            {config?.description}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontWeight={"medium"}>
                                            Дата изменения
                                        </Text>
                                        <Text>{config?.date}</Text>
                                    </Box>
                                </Stack>
                            </Popover.Body>
                        </Popover.Content>
                    </Popover.Positioner>
                </Portal>
            </Popover.Root>
        </Flex>
    );
};
