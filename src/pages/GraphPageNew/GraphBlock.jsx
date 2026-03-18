import { RADII_MAIN } from "@/config/constants";
import { Center, Flex, Text } from "@chakra-ui/react";
import { Graph } from "./Graph";
import { memo } from "react";

export const GraphBlock = memo(function GraphBlock({ appliedConfig }) {
    const hasDatasets = appliedConfig?.datasets?.length > 0;

    return (
        <Flex
            px={6}
            py={4}
            gap={4}
            bg={"bg.panel"}
            borderRadius={RADII_MAIN}
            shadow={"md"}
            w={"full"}
            flex={1}
            minH={0}
        >
            {!hasDatasets ? (
                <Center w={"full"} h={"full"}>
                    <Text color={"fg.muted"}>
                        Добавьте и примените хотя бы один датасет
                    </Text>
                </Center>
            ) : (
                <Graph appliedConfig={appliedConfig} />
            )}
        </Flex>
    );
});
