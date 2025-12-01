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

import { LuCheck, LuSend } from "react-icons/lu";
import { useLecense } from "./Settings/hooks/useLecense";
import { useMutation } from "@tanstack/react-query";
import { apiv2 } from "@/api/baseUrl";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { ErrorModal } from "./Settings/ErrorModal";

export const Lecesne = () => {
    const { data, isError, refetch } = useLecense("Vryd3q7NQ3BLOOpIuGYsW");
    const [active, setActive] = useState(data);

    useEffect(() => {
        if (data) {
            setActive(data);
        }
    }, [data]);

    const lecenseMutation = useMutation({
        mutationKey: ["lecenseActivator"],
        mutationFn: async ({ uuid, key }) => {
            await new Promise((res) => setTimeout(res, 1000));
            return await apiv2
                .post("activateLec", { uuid, key })
                .then((res) => console.log(res))
                .catch((err) => {
                    throw err;
                });
        },
        onSuccess: () => {
            setActive(true);
        },
        onError: (err) => {
            const status = err?.response?.data?.error || "NO CONNECTION";
            const code = err?.response?.status || "NO CONNECTION";
            toaster.create({
                description: "Ошибка при активации ПО: " + `${status} ${code}`,
                type: "error",
                closable: true,
            });
        },
    });
    return (
        <>
            <Heading paddingBottom={"2"}>Регистрация ПО</Heading>
            <Card.Root variant={"elevated"}>
                <Card.Header>
                    <Text fontSize={"lg"} fontWeight="medium">
                        UUID и активация ПО
                    </Text>
                </Card.Header>
                <Card.Body>
                    {isError && (
                        <ErrorModal
                            text={"Ошибка при проверке лецензии"}
                            refetch={refetch}
                        />
                    )}
                    <HStack justifyContent={"space-between"} align={"stretch"}>
                        <Field.Root>
                            <Field.Label>
                                Ваш универсальный уникальный идентификатор
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
                                <KeyInput lecenseMutation={lecenseMutation} />
                            </Field.Root>
                        )}
                    </HStack>
                </Card.Body>
            </Card.Root>
        </>
    );
};
const KeyInput = ({ lecenseMutation }) => {
    const [key, setKey] = useState("");
    return (
        <Group attached w={"100%"}>
            <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                variant="flushed"
                placeholder="Введите свой ключ активации"
                h={"50%"}
            />
            <IconButton
                loading={lecenseMutation.isPending}
                variant={"plain"}
                onClick={() =>
                    lecenseMutation.mutate({
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
