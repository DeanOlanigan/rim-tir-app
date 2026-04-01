import {
    Card,
    Heading,
    IconButton,
    Input,
    Text,
    HStack,
    Field,
    Icon,
    Clipboard,
    VStack,
    InputGroup,
    Skeleton,
} from "@chakra-ui/react";
import { Suspense, useMemo, useState } from "react";
import { LuCheck, LuInfo, LuSend, LuTriangleAlert } from "react-icons/lu";
import { useLicenseMutation } from "./hooks/useLicenseMutation";
import { useLicense } from "./hooks/useLicense";
import { ToggleTip } from "@/components/ui/toggle-tip";

function isLicenseExpired(expireDate) {
    if (!expireDate) return false;

    const expire = new Date(expireDate);
    if (Number.isNaN(expire.getTime())) return false;

    return Date.now() >= expire.getTime();
}

export const License = () => {
    return (
        <VStack align={"stretch"}>
            <Heading>Регистрация ПО</Heading>
            <Suspense fallback={<Skeleton height="160px" />}>
                <LicenseBlock />
            </Suspense>
        </VStack>
    );
};

const LicenseBlock = () => {
    const { data } = useLicense();
    const isKeyEnd = useMemo(
        () => isLicenseExpired(data?.expireDate),
        [data?.expireDate],
    );

    const isActive = Boolean(data?.isActive);
    const showActiveState = isActive && !isKeyEnd;

    return (
        <Card.Root variant={"elevated"}>
            <Card.Header flexDirection={"row"} gap={4}>
                <Text fontSize={"lg"} fontWeight="medium">
                    Идентификатор оборудования и активация ПО
                </Text>
                {(isKeyEnd || !isActive) && (
                    <Icon
                        size={"lg"}
                        color={"fg.error"}
                        title={
                            isKeyEnd
                                ? "Обновите ключ активации"
                                : "Зарегестрируйте ПО"
                        }
                        as={LuTriangleAlert}
                    />
                )}
            </Card.Header>
            <Card.Body gap={2}>
                {isKeyEnd && (
                    <Text fontSize={"lg"} fontWeight={"bold"} color={"red.400"}>
                        Ваша лицензия недействительна. Введите новый ключ или
                        обратитесь в техническую поддержку.
                    </Text>
                )}
                <HStack
                    justifyContent={"space-between"}
                    align={"stretch"}
                    gap={8}
                >
                    <Field.Root>
                        <Field.Label>
                            Уникальный идентификатор
                            <ToggleTip
                                showArrow
                                size={"xs"}
                                content={
                                    <Text w={"sm"}>
                                        Это уникальный идентификатор вашего
                                        оборудования, который используется для
                                        активации программного обеспечения.
                                        Скопируйте этот идентификатор и
                                        предоставьте его поставщику для
                                        получения ключа активации.
                                    </Text>
                                }
                            >
                                <IconButton size={"2xs"} variant={"ghost"}>
                                    <LuInfo />
                                </IconButton>
                            </ToggleTip>
                        </Field.Label>
                        <Clipboard.Root w={"100%"} value={data?.deviceCode}>
                            <InputGroup endElement={<ClipboardIconButton />}>
                                <Clipboard.Input size={"xs"} asChild>
                                    <Input />
                                </Clipboard.Input>
                            </InputGroup>
                        </Clipboard.Root>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label h={"24px"}>
                            {showActiveState
                                ? "Статус лицензии"
                                : "Ввод ключа для активации ПО"}
                        </Field.Label>
                        {showActiveState ? <KeyIsActive /> : <KeyInput />}
                    </Field.Root>
                </HStack>
            </Card.Body>
        </Card.Root>
    );
};

const ClipboardIconButton = () => {
    return (
        <Clipboard.Trigger asChild>
            <IconButton variant="surface" size="2xs" me="-2">
                <Clipboard.Indicator />
            </IconButton>
        </Clipboard.Trigger>
    );
};

const ActivateIconButton = ({ isPending, isDisabled, handleSubmit }) => {
    return (
        <IconButton
            variant={"surface"}
            size={"2xs"}
            me="-2"
            loading={isPending}
            disabled={isDisabled}
            onClick={handleSubmit}
        >
            <LuSend />
        </IconButton>
    );
};

const KeyInput = () => {
    const [key, setKey] = useState("");
    const licenseMutation = useLicenseMutation();

    const trimmedKey = key.trim();
    const isDisabled = !trimmedKey || licenseMutation.isPending;

    const handleSubmit = () => {
        if (!trimmedKey) return;
        licenseMutation.mutate(
            { license: trimmedKey },
            {
                onSuccess: () => {
                    setKey("");
                },
            },
        );
    };

    return (
        <InputGroup
            endElement={
                <ActivateIconButton
                    isPending={licenseMutation.isPending}
                    isDisabled={isDisabled}
                    handleSubmit={handleSubmit}
                />
            }
        >
            <Input
                size={"xs"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
                placeholder={"Введите свой ключ активации"}
            />
        </InputGroup>
    );
};

const KeyIsActive = () => {
    return (
        <HStack
            w="100%"
            h={"32px"}
            px={3}
            py={1}
            borderWidth="1px"
            borderRadius="md"
            bg="green.subtle"
            color="green.fg"
            justify="space-between"
        >
            <Text fontSize="md" fontWeight="medium">
                ПО активировано
            </Text>
            <Icon boxSize={5} as={LuCheck} />
        </HStack>
    );
};
