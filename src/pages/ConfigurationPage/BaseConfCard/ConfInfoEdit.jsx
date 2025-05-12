import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
} from "../../../components/ui/popover";
import {
    Button,
    Text,
    Flex,
    Box,
    Field,
    Input,
    Textarea,
} from "@chakra-ui/react";
import { useVariablesStore } from "../../../store/variables-store";
import { useEffect, useState } from "react";

export const ConfInfoEdit = () => {
    const setConfigInfo = useVariablesStore((state) => state.setConfigInfo);
    const {
        name: stateName,
        description: stateDescription,
        version,
        date,
    } = useVariablesStore((state) => state.configInfo);

    const [name, setName] = useState(stateName);
    const [description, setDescription] = useState(stateDescription);

    useEffect(() => {
        setName(stateName);
        setDescription(stateDescription);
    }, [stateName, stateDescription]);

    const saveHandler = () => {
        setConfigInfo({
            name,
            description,
            date: new Date().toLocaleString("ru-RU", {}),
            version: "1.0",
        });
    };

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
                        {stateName}
                    </Text>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverBody>
                    <Flex gap={"2"} direction={"column"}>
                        <Field.Root>
                            <Field.Label>Название</Field.Label>
                            <Input
                                size={"xs"}
                                value={name}
                                maxLength={20}
                                onChange={(e) => {
                                    setName(e.currentTarget.value);
                                }}
                            />
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>Описание</Field.Label>
                            <Textarea
                                resize={"none"}
                                rows={5}
                                size={"xs"}
                                value={description}
                                placeholder="Описание"
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                        </Field.Root>
                        <Flex justify={"space-between"}>
                            <Box>
                                <Text fontSize={"sm"} color={"fg.muted"}>
                                    Дата изменения:
                                </Text>
                                <Text fontSize={"md"}>{date}</Text>
                            </Box>
                            <Box>
                                <Text fontSize={"sm"} color={"fg.muted"}>
                                    Версия:
                                </Text>
                                <Text fontSize={"md"}>{version}</Text>
                            </Box>
                        </Flex>
                        <Flex>
                            <Button
                                w={"100%"}
                                size={"xs"}
                                disabled={!name?.trim()}
                                onClick={saveHandler}
                            >
                                Сохранить
                            </Button>
                        </Flex>
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
};
