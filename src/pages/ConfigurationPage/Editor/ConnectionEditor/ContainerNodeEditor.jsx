import { Heading, Flex, HStack, SimpleGrid } from "@chakra-ui/react";
import { PARENT_NAMES } from "../../../../config/paramDefinitions";
import { BaseInput } from "../../InputComponents/BaseInput";

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
            {data.setting && (
                <SimpleGrid columns={4} columnGap={"2"} rowGap={"2"}>
                    {Object.keys(data.setting).map((key, index) => {
                        if (key === "variable") return null;

                        return (
                            <BaseInput
                                key={index}
                                value={data.setting[key]}
                                id={data.id}
                                inputParam={key}
                                showLabel
                            />
                        );
                    })}
                </SimpleGrid>
            )}
        </Flex>
    );
};
