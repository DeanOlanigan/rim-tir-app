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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuCheck, LuSend, LuTriangleAlert } from "react-icons/lu";
import { useLicenseCheck } from "./hooks/useLicenseCheck";
import { useLicenseMutation } from "./hooks/useLicenseMutation";
import { useLicense } from "./hooks/useLicense";

function checkDate(endDate, setIsKeyEnd) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;
    console.log(date);
    console.log(date >= endDate);
    setIsKeyEnd(date >= endDate);
}

export const License = () => {
    const { data: uuid } = useLicense();
    const { data } = useLicenseCheck(uuid);
    const [isKeyEnd, setIsKeyEnd] = useState(false);
    useEffect(() => checkDate(data.endDate, setIsKeyEnd), [data.endDate]);

    const licenseMutation = useLicenseMutation(setIsKeyEnd, uuid);

    return (
        <>
            <LicenseHead isKeyEnd={isKeyEnd} isActive={data.isActive} />
            <Card.Root variant={"elevated"} minH={"0.5"}>
                <Card.Header>
                    <Text fontSize={"lg"} fontWeight="medium">
                        Идентификатор оборудования и активация ПО
                    </Text>
                </Card.Header>
                <Card.Body>
                    <HStack justifyContent={"space-between"} align={"stretch"}>
                        <Field.Root>
                            <Field.Label>
                                Ваш универсальный уникальный идентификатор
                            </Field.Label>
                            <Text>{uuid}</Text>
                        </Field.Root>
                        {data.isActive && !isKeyEnd ? (
                            <KeyIsActive />
                        ) : (
                            <Field.Root>
                                <Field.Label>
                                    Ввод ключа для активации ПО
                                </Field.Label>
                                <KeyInput
                                    licenseMutation={licenseMutation}
                                    uuid={uuid}
                                />
                            </Field.Root>
                        )}
                    </HStack>
                </Card.Body>
                {isKeyEnd && (
                    <Card.Footer>
                        <Text
                            fontSize={"xl"}
                            fontWeight={"bold"}
                            color={"red.400"}
                        >
                            Ваша лицензия недействительна! Введите новый ключ
                            или обратитесь в тех. поддержку!
                        </Text>
                    </Card.Footer>
                )}
            </Card.Root>
        </>
    );
};
const KeyInput = ({ licenseMutation, uuid }) => {
    const [key, setKey] = useState("");
    return (
        <Group attached w={"100%"}>
            <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                variant="flushed"
                placeholder={"Введите свой ключ активации"}
                h={"50%"}
            />
            <IconButton
                loading={licenseMutation.isPending}
                variant={"plain"}
                onClick={() =>
                    licenseMutation.mutate({
                        uuid: uuid,
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
            <Icon size={"xl"} color={"green"} as={LuCheck} />
        </Group>
    );
};

const LicenseHead = ({ isKeyEnd, isActive }) => {
    return (
        <HStack>
            <Heading paddingBottom={"2"}>Регистрация ПО</Heading>
            {(isKeyEnd || !isActive) && (
                <Icon
                    size={"xl"}
                    paddingBottom={"2"}
                    color={"fg.error"}
                    title={
                        isKeyEnd
                            ? "Обновите ключ активации"
                            : "Зарегестрируйте ПО"
                    }
                    as={LuTriangleAlert}
                />
            )}
        </HStack>
    );
};
