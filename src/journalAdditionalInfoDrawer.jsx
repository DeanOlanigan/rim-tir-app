import {
    Badge,
    Box,
    CloseButton,
    Code,
    createOverlay,
    Drawer,
    HStack,
    Portal,
    Separator,
    Stack,
    Text,
} from "@chakra-ui/react";

export const JOURNAL_INFO_DRAWER_ID = "JOURNAL_INFO_DRAWER_ID";

function LabeledValue({ label, value }) {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    return (
        <HStack align="start" justify="space-between" gap="4">
            <Text color="fg.muted" minW="140px">
                {label}
            </Text>
            <Text textAlign="right" whiteSpace="pre-wrap">
                {String(value)}
            </Text>
        </HStack>
    );
}

function Section({ title, children }) {
    return (
        <Stack gap="3">
            <Text fontWeight="semibold">{title}</Text>
            <Stack gap="2">{children}</Stack>
        </Stack>
    );
}

function getSeverityColorPalette(severity) {
    switch (severity) {
        case "critical":
        case "error":
            return "red";
        case "warning":
            return "orange";
        default:
            return "blue";
    }
}

function renderVariablePayload(event) {
    const payload = event?.payload;
    const variable = payload?.variable;
    const change = payload?.change;
    const threshold = payload?.threshold;
    const limits = payload?.limits;

    return (
        <Section title="Данные события">
            <LabeledValue label="Переменная" value={variable?.name} />
            <LabeledValue label="Описание" value={variable?.desc} />
            <LabeledValue label="Группа" value={variable?.group} />
            <LabeledValue label="Тип данных" value={variable?.dataType} />
            <LabeledValue label="Ед. изм." value={variable?.unit} />

            {change && (
                <>
                    <Separator />
                    <LabeledValue
                        label="Старое значение"
                        value={change?.oldValue}
                    />
                    <LabeledValue
                        label="Новое значение"
                        value={change?.newValue}
                    />
                    <LabeledValue label="Δ" value={change?.delta} />
                </>
            )}

            {threshold && (
                <>
                    <Separator />
                    <LabeledValue label="Тип порога" value={threshold?.kind} />
                    <LabeledValue label="Порог" value={threshold?.value} />
                    <LabeledValue
                        label="Текущее значение"
                        value={payload?.value}
                    />
                </>
            )}

            {limits && (
                <>
                    <Separator />
                    <LabeledValue label="Нижний предел" value={limits?.low} />
                    <LabeledValue label="Верхний предел" value={limits?.high} />
                </>
            )}

            <LabeledValue label="Качество" value={payload?.quality} />
        </Section>
    );
}

function renderUserPayload(event) {
    const payload = event?.payload;

    return (
        <Section title="Данные события">
            <LabeledValue label="Пользователь" value={payload?.user?.name} />
            <LabeledValue label="Логин" value={payload?.user?.login} />
            <LabeledValue label="ID пользователя" value={payload?.user?.id} />
            <LabeledValue label="ID сессии" value={payload?.session?.id} />
            <LabeledValue label="IP адрес" value={payload?.session?.ip} />
            <LabeledValue label="Причина" value={payload?.reason} />
        </Section>
    );
}

function renderAckPayload(event) {
    const payload = event?.payload;

    return (
        <Section title="Квитированное событие">
            <LabeledValue label="ID события" value={payload?.targetEvent?.id} />
            <LabeledValue
                label="Тип события"
                value={payload?.targetEvent?.event}
            />
            <LabeledValue
                label="Сообщение"
                value={payload?.targetEvent?.message}
            />
        </Section>
    );
}

function renderConfigPayload(event) {
    const payload = event?.payload;

    return (
        <Section title="Данные события">
            <LabeledValue
                label="Исходная конфигурация"
                value={payload?.fromName}
            />
            <LabeledValue label="Хэш исходной" value={payload?.fromHash} />
            <LabeledValue label="Новая конфигурация" value={payload?.toName} />
            <LabeledValue label="Хэш новой" value={payload?.toHash} />
        </Section>
    );
}

function renderHmiPayload(event) {
    const payload = event?.payload;

    return (
        <Section title="Данные события">
            <LabeledValue label="Проект" value={payload?.project?.name} />
            <LabeledValue label="Файл" value={payload?.file?.name} />
            <LabeledValue label="Размер файла" value={payload?.file?.size} />
        </Section>
    );
}

function renderServerPayload(event) {
    const payload = event?.payload;

    return (
        <Section title="Данные события">
            <LabeledValue label="Область" value={payload?.scope} />
            <LabeledValue label="Причина" value={payload?.reason} />
            <LabeledValue label="Дополнительно" value={payload?.details} />
        </Section>
    );
}

function renderSettingsPayload(event) {
    const payload = event?.payload;
    const changes = payload?.changes || [];

    return (
        <Section title="Изменения настроек">
            <LabeledValue label="Раздел" value={payload?.settings?.section} />

            {changes.length > 0 && (
                <Stack gap="2">
                    {changes.map((change, index) => (
                        <Box
                            key={`${change.field}-${index}`}
                            p="3"
                            borderWidth="1px"
                            borderRadius="md"
                        >
                            <LabeledValue label="Поле" value={change?.field} />
                            <LabeledValue
                                label="Старое значение"
                                value={change?.oldValue}
                            />
                            <LabeledValue
                                label="Новое значение"
                                value={change?.newValue}
                            />
                        </Box>
                    ))}
                </Stack>
            )}
        </Section>
    );
}

function renderSecurityPayload(event) {
    const payload = event?.payload;
    const changes = payload?.changes || [];

    return (
        <Section title="Данные события">
            <LabeledValue label="Пользователь" value={payload?.user?.name} />
            <LabeledValue label="Логин" value={payload?.user?.login} />
            <LabeledValue label="ID пользователя" value={payload?.user?.id} />

            <LabeledValue label="Роль" value={payload?.role?.name} />
            <LabeledValue label="ID роли" value={payload?.role?.id} />

            <LabeledValue label="Ключ лицензии" value={payload?.key} />
            <LabeledValue label="Статус лицензии" value={payload?.status} />

            {changes.length > 0 && (
                <>
                    <Separator />
                    <Text fontWeight="medium">Изменения</Text>
                    <Stack gap="2">
                        {changes.map((change, index) => (
                            <Box
                                key={`${change.field}-${index}`}
                                p="3"
                                borderWidth="1px"
                                borderRadius="md"
                            >
                                <LabeledValue
                                    label="Поле"
                                    value={change?.field}
                                />
                                <LabeledValue
                                    label="Старое значение"
                                    value={change?.oldValue}
                                />
                                <LabeledValue
                                    label="Новое значение"
                                    value={change?.newValue}
                                />
                            </Box>
                        ))}
                    </Stack>
                </>
            )}
        </Section>
    );
}

function renderSystemPayload(event) {
    const payload = event?.payload;
    const update = payload?.update;

    return (
        <Section title="Данные события">
            <LabeledValue label="С версии" value={update?.fromVersion} />
            <LabeledValue label="До версии" value={update?.toVersion} />
            <LabeledValue label="Пакет" value={update?.packageName} />
            <LabeledValue label="Дополнительно" value={payload?.details} />
        </Section>
    );
}

function EventPayloadView({ event }) {
    switch (event?.category) {
        case "variable":
            return renderVariablePayload(event);
        case "user":
            return renderUserPayload(event);
        case "event":
            return renderAckPayload(event);
        case "config":
            return renderConfigPayload(event);
        case "hmi":
            return renderHmiPayload(event);
        case "server":
            return renderServerPayload(event);
        case "settings":
            return renderSettingsPayload(event);
        case "security":
            return renderSecurityPayload(event);
        case "system":
            return renderSystemPayload(event);
        default:
            return (
                <Section title="Payload">
                    <Text color="fg.muted">
                        Нет дополнительного шаблона отображения.
                    </Text>
                </Section>
            );
    }
}

export const journalAdditionalInfoDrawer = createOverlay((props) => {
    const { event, ...rest } = props;

    const severityPalette = getSeverityColorPalette(event?.severity);

    return (
        <Drawer.Root {...rest} lazyMount unmountOnExit size={"md"}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner pe={"4"} py={"4"}>
                    <Drawer.Content rounded="lg">
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="xs" />
                        </Drawer.CloseTrigger>

                        <Drawer.Header>
                            <Stack gap="2">
                                <Drawer.Title>
                                    Дополнительная информация
                                </Drawer.Title>

                                {event && (
                                    <HStack gap="2" wrap="wrap">
                                        <Badge colorPalette={severityPalette}>
                                            {event.severity}
                                        </Badge>
                                        <Badge variant="outline">
                                            {event.category}
                                        </Badge>
                                        <Badge variant="subtle">
                                            {event.event}
                                        </Badge>
                                    </HStack>
                                )}
                            </Stack>
                        </Drawer.Header>

                        <Drawer.Body>
                            {!event ? (
                                <Text color="fg.muted">
                                    Событие не найдено.
                                </Text>
                            ) : (
                                <Stack gap="5">
                                    <Section title="Основное">
                                        <LabeledValue
                                            label="Время"
                                            value={event.tsText}
                                        />
                                        <LabeledValue
                                            label="Сообщение"
                                            value={event.message}
                                        />
                                        <LabeledValue
                                            label="ID события"
                                            value={event.id}
                                        />
                                        <LabeledValue
                                            label="Версия схемы"
                                            value={event.schemaVersion}
                                        />
                                    </Section>

                                    <Section title="Источник / инициатор">
                                        <LabeledValue
                                            label="Тип"
                                            value={event.actor?.type}
                                        />
                                        <LabeledValue
                                            label="Имя"
                                            value={event.actor?.name}
                                        />
                                        <LabeledValue
                                            label="Логин"
                                            value={event.actor?.login}
                                        />
                                        <LabeledValue
                                            label="ID"
                                            value={event.actor?.id}
                                        />
                                    </Section>

                                    <Section title="Квитирование">
                                        <LabeledValue
                                            label="Статус"
                                            value={event.ack?.state}
                                        />
                                        <LabeledValue
                                            label="Квитировал"
                                            value={event.ackByText}
                                        />
                                        <LabeledValue
                                            label="Время квитирования"
                                            value={event.ackTimeText}
                                        />
                                    </Section>

                                    <EventPayloadView event={event} />

                                    <Section title="Payload JSON">
                                        <Code
                                            display="block"
                                            whiteSpace="pre-wrap"
                                            p="3"
                                            borderRadius="md"
                                            fontSize="xs"
                                        >
                                            {JSON.stringify(
                                                event.payload ?? {},
                                                null,
                                                2,
                                            )}
                                        </Code>
                                    </Section>
                                </Stack>
                            )}
                        </Drawer.Body>

                        <Drawer.Footer />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
});
