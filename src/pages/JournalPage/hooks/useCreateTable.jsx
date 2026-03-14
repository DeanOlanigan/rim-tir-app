import { useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
    LuCircleAlert,
    LuInfo,
    LuPause,
    LuPlay,
    LuTriangleAlert,
} from "react-icons/lu";
import { AckButtonCellChakra } from "../JournalView/AckButtonCell";
import { Icon } from "@chakra-ui/react";

const EVENT_LABEL_MAP = {
    "variable.value_changed": "Изменение значения переменной",
    "variable.state_changed": "Изменение состояния переменной",
    "variable.quality_changed": "Изменение качества переменной",
    "variable.threshold_high": "Превышение верхнего порога",
    "variable.threshold_low": "Превышение нижнего порога",

    "user.login": "Вход пользователя",
    "user.logout": "Выход пользователя",
    "user.login_failed": "Неудачная попытка входа",
    "user.session_expired": "Сессия пользователя истекла",
    "user.pause": "Пауза журнала",
    "user.resume": "Возобновление журнала",

    "event.acknowledged": "Событие квитировано",

    "config.updated": "Конфигурация обновлена",

    "hmi.opened": "Открыта мнемосхема",
    "hmi.upload": "Мнемосхема загружена",
    "hmi.saved": "Мнемосхема сохранена",
    "hmi.deleted": "Мнемосхема удалена",

    "server.started": "Сервер запущен",
    "server.stopped": "Сервер остановлен",
    "server.restarted": "Сервер перезапущен",
    "server.error": "Ошибка сервера",
    "server.warning": "Предупреждение сервера",

    "settings.webserver.changed": "Изменены настройки веб-сервера",
    "settings.retention.changed": "Изменены настройки хранения данных",

    "security.users.changed": "Изменены пользователи",
    "security.users.deleted": "Пользователь удален",
    "security.roles.changed": "Изменены роли",
    "security.roles.deleted": "Роль удалена",
    "security.license.changed": "Изменена лицензия",
    "security.license.expired": "Срок действия лицензии истек",

    "system.software_update.started": "Начато обновление ПО",
    "system.software_update.finished": "Обновление ПО завершено",
    "system.software_update.failed": "Ошибка обновления ПО",
    "system.software_update.canceled": "Обновление ПО отменено",
};

const typePalette = {
    info: "var(--chakra-colors-fg-info)",
    warning: "var(--chakra-colors-fg-warning)",
    error: "var(--chakra-colors-fg-error)",
    critical: "var(--chakra-colors-fg-error)",
    ts: "var(--chakra-colors-fg-info)",
    tu: "var(--chakra-colors-fg-info)",
    pause: "var(--chakra-colors-fg-success)",
    resume: "var(--chakra-colors-fg-success)",
};

const typeIcon = {
    info: LuInfo,
    warning: LuCircleAlert,
    error: LuTriangleAlert,
    critical: LuTriangleAlert,
    ts: LuInfo,
    tu: LuInfo,
    pause: LuPause,
    resume: LuPlay,
};

const buildAccessor = (column) => {
    switch (column.value) {
        case "type":
            return (row) => row.severity;
        case "tsText":
            return (row) => row.tsText;
        case "event":
            return (row) => EVENT_LABEL_MAP[row.event] ?? "Неизвестное событие";
        case "info":
            return (row) => row.message ?? null;
        case "user":
            return (row) => row.actorText;
        case "ackTimeText":
            return (row) => row.ackTimeText;
        case "who_ack":
            return (row) => row.ackByText;
        case "needAck":
            return (row) => row.ack?.state === "pending";
        default:
            return (row) => row[column.value] ?? "";
    }
};

export const useCreateTable = (filteredColumns, filteredData) => {
    const columns = useMemo(
        () =>
            filteredColumns.map((column) => ({
                id: column.value,
                accessorFn: buildAccessor(column),
                header: column.label,
                minSize: column.minSize,
                meta: {
                    grow: column.grow,
                },
                cell: ({ getValue, row }) => {
                    switch (column.value) {
                        case "needAck": {
                            if (!getValue()) return null;
                            return <AckButtonCellChakra id={row.original.id} />;
                        }
                        case "type": {
                            const severity = row.original.severity;
                            const cellColor = typePalette[severity];
                            const CellIcon = typeIcon[severity];
                            return (
                                CellIcon && (
                                    <Icon
                                        as={CellIcon}
                                        color={cellColor}
                                        size={"lg"}
                                    />
                                )
                            );
                        }
                        default: {
                            const value = getValue();
                            return String(value ?? "");
                        }
                    }
                },
            })),
        [filteredColumns],
    );

    return useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row, index) => row.id ?? `${row.ts}-${index}`,
    });
};
