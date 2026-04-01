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
    Stack,
    VStack,
} from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { useController, useFormContext, useWatch } from "react-hook-form";

export const ServerSettings = () => {
    const { control } = useFormContext();

    const https = useWatch({
        control,
        name: "webServer.https",
    });

    return (
        <VStack align={"stretch"}>
            <Heading>Web-сервер</Heading>
            <Card.Root variant={"elevated"}>
                <Card.Body>
                    <Fieldset.Root>
                        <Fieldset.Legend>
                            <Text fontSize={"lg"}>Параметры Web-сервера</Text>
                        </Fieldset.Legend>
                        <Fieldset.Content>
                            <Stack gap={2}>
                                <PortField />
                                <SessionTtlField />
                                <HttpsField />
                                {https && <CertificateField />}
                            </Stack>
                        </Fieldset.Content>
                    </Fieldset.Root>
                </Card.Body>
            </Card.Root>
        </VStack>
    );
};

const NumberField = ({ value, onChange, min, max }) => {
    return (
        <NumberInput.Root
            w="100%"
            size="xs"
            value={value?.toString() ?? ""}
            min={min}
            max={max}
            onValueChange={(e) => onChange(e.value)}
        >
            <NumberInput.Control />
            <NumberInput.Input />
        </NumberInput.Root>
    );
};

const PortField = () => {
    const { control } = useFormContext();

    const {
        field,
        fieldState: { error },
    } = useController({
        name: "webServer.port",
        control,
    });

    return (
        <Field.Root invalid={!!error}>
            <Field.Label>Порт</Field.Label>
            <NumberField
                value={field.value}
                onChange={field.onChange}
                min="1024"
                max="65535"
            />
            <Field.ErrorText>{error?.message}</Field.ErrorText>
        </Field.Root>
    );
};

const SessionTtlField = () => {
    const { control } = useFormContext();

    const {
        field,
        fieldState: { error },
    } = useController({
        name: "webServer.sessionTtlHours",
        control,
    });

    return (
        <Field.Root invalid={!!error}>
            <Field.Label>Время сессии, час</Field.Label>

            <NumberField
                value={field.value}
                onChange={field.onChange}
                min="1"
                max={"24"}
            />
            <Field.ErrorText>{error?.message}</Field.ErrorText>
        </Field.Root>
    );
};

const HttpsField = () => {
    const { control, setValue } = useFormContext();

    const { field } = useController({
        name: "webServer.https",
        control,
    });

    return (
        <Switch.Root
            checked={!!field.value}
            onCheckedChange={(e) => {
                const checked = !!e.checked;
                field.onChange(checked);

                if (!checked) {
                    setValue("webServer.certificateFile", null, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                }
            }}
        >
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>HTTPS</Switch.Label>
        </Switch.Root>
    );
};

const CertificateField = () => {
    const { control, setValue } = useFormContext();

    const {
        fieldState: { error },
    } = useController({
        name: "webServer.certificateFile",
        control,
    });

    const certificateId = useWatch({
        control,
        name: "webServer.certificateId",
    });

    const certificateFile = useWatch({
        control,
        name: "webServer.certificateFile",
    });

    const hasSavedCertificate = !!certificateId;
    const selectedFileName = certificateFile?.name || null;

    let certText = "Сертификат не выбран";
    if (hasSavedCertificate) {
        certText = "Сертификат уже загружен";
    } else if (selectedFileName) {
        certText = `Выбран файл: ${selectedFileName}`;
    }

    return (
        <Field.Root invalid={!!error}>
            <Field.Label>Сертификат</Field.Label>

            <FileUpload.Root>
                <FileUpload.HiddenInput
                    accept=".crt,.pem,.cer"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;

                        setValue("webServer.certificateFile", file, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }}
                />

                <FileUpload.Trigger asChild>
                    <Button variant="ghost" size="sm">
                        <LuUpload />
                        {selectedFileName || hasSavedCertificate
                            ? "Заменить сертификат"
                            : "Загрузить сертификат"}
                    </Button>
                </FileUpload.Trigger>
            </FileUpload.Root>

            <Text mt="2" fontSize="sm">
                {certText}
            </Text>

            <Field.ErrorText>{error?.message}</Field.ErrorText>
        </Field.Root>
    );
};
