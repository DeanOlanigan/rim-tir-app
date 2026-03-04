import {
    Heading,
    NumberInput,
    Field,
    Fieldset,
    Card,
    Switch,
    FileUpload,
    Text,
    Button,
} from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { Controller, useFormContext } from "react-hook-form";

export const ServerSettings = () => {
    const {
        control,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const https = watch("webServer.https");
    const certificate = watch("webServer.certificate");

    return (
        <>
            <Heading>Web-сервер</Heading>
            <Card.Root variant={"elevated"}>
                <Card.Body>
                    <Fieldset.Root>
                        <Fieldset.Legend>
                            <Text fontSize={"lg"}>Параметры Web-сервера</Text>
                        </Fieldset.Legend>
                        <Fieldset.Content>
                            <Field.Root invalid={!!errors.webServer?.port}>
                                <Field.Label>Порт</Field.Label>
                                <Controller
                                    name="webServer.port"
                                    control={control}
                                    render={({ field }) => (
                                        <NumberInput.Root
                                            w="100%"
                                            size={"xs"}
                                            value={
                                                field.value?.toString() ?? ""
                                            }
                                            min={"1024"}
                                            max={"65535"}
                                            onValueChange={(e) =>
                                                field.onChange(e.value)
                                            }
                                        >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                    )}
                                />
                                <Field.ErrorText>
                                    {errors.webServer?.port?.message}
                                </Field.ErrorText>
                            </Field.Root>

                            <Field.Root
                                invalid={!!errors.webServer?.sessionTtlMinutes}
                            >
                                <Field.Label>Время сессии, мин</Field.Label>
                                <Controller
                                    name="webServer.sessionTtlMinutes"
                                    control={control}
                                    render={({ field }) => (
                                        <NumberInput.Root
                                            w="100%"
                                            size="xs"
                                            value={
                                                field.value?.toString() ?? ""
                                            }
                                            min="1"
                                            max={(24 * 60).toString()}
                                            onValueChange={(e) =>
                                                field.onChange(e.value)
                                            }
                                        >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                        </NumberInput.Root>
                                    )}
                                />
                                <Field.ErrorText>
                                    {
                                        errors.webServer?.sessionTtlMinutes
                                            ?.message
                                    }
                                </Field.ErrorText>
                            </Field.Root>

                            <Controller
                                name="webServer.https"
                                control={control}
                                render={({ field }) => (
                                    <Switch.Root
                                        checked={field.value}
                                        onCheckedChange={(e) => {
                                            field.onChange(e.checked);
                                        }}
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                        <Switch.Label>HTTPS</Switch.Label>
                                    </Switch.Root>
                                )}
                            />

                            {https && (
                                <Field.Root
                                    invalid={!!errors.webServer?.certificate}
                                >
                                    <FileUpload.Root>
                                        <FileUpload.HiddenInput
                                            accept=".crt,.pem,.cer"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0] ?? null;
                                                setValue(
                                                    "webServer.certificate",
                                                    file,
                                                    {
                                                        shouldDirty: true,
                                                        shouldValidate: true,
                                                    },
                                                );
                                            }}
                                        />

                                        <FileUpload.Trigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <LuUpload />
                                                {certificate
                                                    ? "Заменить сертификат"
                                                    : "Загрузить сертификат"}
                                            </Button>
                                        </FileUpload.Trigger>
                                    </FileUpload.Root>

                                    <Text mt="2" fontSize="sm">
                                        {certificate
                                            ? `Файл: ${certificate.name}`
                                            : "Сертификат не выбран"}
                                    </Text>

                                    <Field.ErrorText>
                                        {errors.webServer?.certificate?.message}
                                    </Field.ErrorText>
                                </Field.Root>
                            )}
                        </Fieldset.Content>
                    </Fieldset.Root>
                </Card.Body>
            </Card.Root>
        </>
    );
};
