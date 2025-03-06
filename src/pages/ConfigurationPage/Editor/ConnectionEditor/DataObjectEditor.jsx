import { Flex, Box, AbsoluteCenter, Text, SimpleGrid } from "@chakra-ui/react";
import { BaseInput } from "../../InputComponents/BaseInput";
import { EditorBreadcrumb } from "../Breadcrumb";

export const DataObjectEditor = ({ data }) => {
    return (
        <Flex direction={"column"} gap={"4"} w={"100%"} h={"100%"} px={"1"}>
            <EditorBreadcrumb data={data} />
            <SimpleGrid columns={2} columnGap={"2"} rowGap={"2"} w={"100%"}>
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
            <Box
                w={"100%"}
                h={"100%"}
                position={"relative"}
                border={"2px dashed"}
                borderColor={"fg.info"}
                borderRadius={"md"}
                backgroundColor={"bg.info"}
            >
                <AbsoluteCenter>
                    <Text fontWeight={"medium"} color={"fg.info"}>
                        {data.setting.variable || "Переместите переменную"}
                    </Text>
                </AbsoluteCenter>
            </Box>
        </Flex>
    );
};
