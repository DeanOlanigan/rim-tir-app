import {
    Card,
    Heading,
    IconButton,
    Input,
    Text,
    Group,
    HStack,
    Field,
} from "@chakra-ui/react";

import { LuSend } from "react-icons/lu";
import { useLecense } from "./useLecense";

export const Lecesne = () => {
    return (
        <>
            <Heading paddingBottom={"2"}>Регистрация ПО</Heading>
            <Card.Root variant={"elevated"}>
                <Card.Header>
                    <Text fontSize={"lg"} fontWeight="medium">
                        Зарегистрируйте ПО
                    </Text>
                </Card.Header>
                <Card.Body>
                    <HStack justifyContent={"space-between"}>
                        <Field.Root>
                            <Field.Label>
                                Ваш универсальный уникальный идентификатор
                            </Field.Label>
                            <Text>{useLecense()}</Text>
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>
                                Ввод ключа для активации ПО
                            </Field.Label>
                            <KeyInput />
                        </Field.Root>
                    </HStack>
                </Card.Body>
            </Card.Root>
        </>
    );
};
const KeyInput = () => {
    return (
        <Group attached w={"100%"}>
            <Input
                variant="flushed"
                placeholder="Введите свой ключ активации"
            />
            <IconButton variant={"plain"} size={"xs"}>
                <LuSend />
            </IconButton>
        </Group>
    );
};
