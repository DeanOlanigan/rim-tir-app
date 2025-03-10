import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
} from "../../../components/ui/popover";
import { Button, Text, Flex, Box } from "@chakra-ui/react";
import { TextInput, DebouncedTextarea } from "../InputComponents";

export const ConfInfoEdit = ({ settings }) => {
    return (
        <PopoverRoot>
            <PopoverTrigger asChild>
                <Button variant="subtle" size="2xs" rounded={"md"} py={"0"}>
                    <Text
                        fontSize={"sm"}
                        fontWeight={"bold"}
                        maxW={"250px"}
                        truncate
                    >
                        {settings?.setting.name}
                    </Text>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverBody>
                    <Flex gap={"2"} direction={"column"}>
                        <TextInput
                            id={settings?.id}
                            value={settings?.setting.name}
                            targetKey={"name"}
                            label={"Наименование"}
                            showLabel
                        />
                        <DebouncedTextarea
                            id={settings?.id}
                            value={settings?.setting.description}
                            targetKey={"description"}
                            label={"Описание"}
                            showLabel
                        />
                        <Flex justify={"space-between"}>
                            <Box>
                                <Text fontSize={"sm"} color={"fg.muted"}>
                                    Дата:
                                </Text>
                                <Text fontSize={"md"}>
                                    {settings?.setting.date}
                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize={"sm"} color={"fg.muted"}>
                                    Версия:
                                </Text>
                                <Text fontSize={"md"}>
                                    {settings?.setting.version}
                                </Text>
                            </Box>
                        </Flex>
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
};
