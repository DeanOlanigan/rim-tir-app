import { Heading, Flex, HStack } from "@chakra-ui/react";
import { PARENT_NAMES } from "@/config/paramDefinitions";
import { ConnectionParamContainer } from "./ConnectionParamContainer";

export const ContainerNodeEditor = ({ data }) => {
    return (
        <Flex
            w={"100%"}
            direction={"column"}
            gap={"4"}
            border={"1px solid"}
            borderColor={"border"}
            borderRadius={"md"}
            shadow={"md"}
            p={"4"}
        >
            <HStack justify={"space-between"}>
                <Heading textWrap={"nowrap"}>
                    {PARENT_NAMES[data.type]} &quot;{data.name}&quot;
                </Heading>
                <Heading textWrap={"nowrap"}>
                    Элементов: {data.children.length}
                </Heading>
            </HStack>
            {data.setting && <ConnectionParamContainer data={data} />}
        </Flex>
    );
};
