import { Box, Stack, StackSeparator, Text } from "@chakra-ui/react";

export const ConfigurationEditor = ({data}) => {
    console.log("Render ConfigurationEditor");
    console.log("ConfigurationEditor data:", data);

    const renderData = (row) => {
        if (!row) return null;
        return row.map((element, index) => {
            if (element.children !== null && row.length <= 1) {
                return renderData(element.children);
            }
            return (
                <Box key={index}>
                    <Text fontWeight={"medium"}>{element.data.type}</Text>
                    {
                        Object.keys(element.data.setting).map((key, index) => {
                            return (
                                <Text
                                    key={index}
                                    wordBreak={"break-all"}
                                    fontSize={"sm"}
                                >
                                    {element.data.setting[key]}
                                </Text>
                            );
                        })
                    }
                </Box>
            );
        });
    };

    return (
        <Stack direction={"column"} separator={<StackSeparator />}>
            { renderData(data) }
        </Stack>
    );
};
