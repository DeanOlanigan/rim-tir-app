import {
    Card,
    Heading,
    IconButton,
    Input,
    Text,
    Group,
    HStack,
    Field,
    Icon,
    Stack,
} from "@chakra-ui/react";

import { LuCheck, LuSend } from "react-icons/lu";
import { useLicense } from "./Settings/hooks/useLicense";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import { useLicenseMutation } from "./Settings/hooks/useLicenseMutation";
import { ErrorModal } from "./Settings/ErrorModal";

export const License = () => {
    const { data, isError, isLoading, refetch } = useLicense(
        "Vryd3q7NQ3BLOOpIuGYsW"
    );
    const [active, setActive] = useState(data);

    useEffect(() => {
        if (data) {
            setActive(data);
        }
    }, [data]);

    const licenseMutation = useLicenseMutation(setActive);

    return (
        <>
            <Heading paddingBottom={"2"}>Регистрация ПО</Heading>
            <Card.Root variant={"elevated"} minH={"0.5"}>
                <Card.Header>
                    <Text fontSize={"lg"} fontWeight="medium">
                        Идентификатор оборудования и активация ПО
                    </Text>
                </Card.Header>
                <Card.Body>
                    {isLoading ? (
                        <Stack position={"relative"} h={"2xs"}>
                            <Loader text={"Проверка лицензии"} />
                        </Stack>
                    ) : (
                        <>
                            {isError && (
                                <ErrorModal
                                    text={"Ошибка проверки лицензии"}
                                    refetch={refetch}
                                />
                            )}
                            <HStack
                                justifyContent={"space-between"}
                                align={"stretch"}
                            >
                                <Field.Root>
                                    <Field.Label>
                                        Ваш универсальный уникальный
                                        идентификатор
                                    </Field.Label>
                                    <Text>Vryd3q7NQ3BLOOpIuGYsW</Text>
                                </Field.Root>
                                {active ? (
                                    <KeyIsActive />
                                ) : (
                                    <Field.Root>
                                        <Field.Label>
                                            Ввод ключа для активации ПО
                                        </Field.Label>
                                        <KeyInput
                                            licenseMutation={licenseMutation}
                                            isError={isError}
                                        />
                                    </Field.Root>
                                )}
                            </HStack>
                        </>
                    )}
                </Card.Body>
            </Card.Root>
        </>
    );
};
const KeyInput = ({ licenseMutation, isError }) => {
    const [key, setKey] = useState("");
    return (
        <Group attached w={"100%"}>
            <Input
                disabled={isError}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                variant="flushed"
                placeholder={
                    isError
                        ? "Ошибка проверки лицензии"
                        : "Введите свой ключ активации"
                }
                h={"50%"}
            />
            <IconButton
                disabled={isError}
                loading={licenseMutation.isPending}
                variant={"plain"}
                onClick={() =>
                    licenseMutation.mutate({
                        uuid: "Vryd3q7NQ3BLOOpIuGYsW",
                        key: `${key}`,
                    })
                }
            >
                <LuSend />
            </IconButton>
        </Group>
    );
};

const KeyIsActive = () => {
    return (
        <Group attached w="100%" paddingLeft={"40%"}>
            <Text fontSize={"xl"} fontWeight={"medium"}>
                ПО активировано
            </Text>
            <Icon size={"xl"} color={"green"}>
                <LuCheck />
            </Icon>
        </Group>
    );
};
