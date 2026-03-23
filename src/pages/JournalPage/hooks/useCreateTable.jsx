import { useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
    LuChevronRight,
    LuCircleAlert,
    LuInfo,
    LuSiren,
    LuTriangleAlert,
} from "react-icons/lu";
import { AckButtonCellChakra } from "../JournalView/AckButtonCell";
import { Icon, IconButton } from "@chakra-ui/react";
import { hasRight } from "@/utils/permissions";
import {
    JOURNAL_INFO_DRAWER_ID,
    journalAdditionalInfoDrawer,
} from "@/journalAdditionalInfoDrawer";

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
    "event.acknowledged.range": "Диапазон событий квитирован",

    "config.updated": "Конфигурация обновлена",

    "hmi.opened": "Открыта мнемосхема",
    "hmi.uploaded": "Мнемосхема загружена",
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

const CATEGORY_LABEL_MAP = {
    variable: "Переменная",
    user: "Пользователь",
    event: "Событие",
    config: "Конфигурация",
    hmi: "HMI",
    server: "Сервер",
    settings: "Настройки",
    security: "Безопасность",
    system: "Система",
};

const typePalette = {
    info: "var(--chakra-colors-fg-info)",
    warning: "var(--chakra-colors-fg-warning)",
    error: "var(--chakra-colors-fg-error)",
    critical: "var(--chakra-colors-fg-error)",
};

const typeIcon = {
    info: LuInfo,
    warning: LuCircleAlert,
    error: LuTriangleAlert,
    critical: LuSiren,
};

const buildAccessor = (column) => {
    switch (column.value) {
        case "type":
            return (row) => row.severity;
        case "tsText":
            return (row) => row.tsText;
        case "category":
            return (row) =>
                CATEGORY_LABEL_MAP[row.category] ?? "Неизвестная категория";
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

const infoCell = ({ value, row }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                minWidth: 0,
            }}
            className="group"
        >
            <span
                style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {String(value ?? "")}
            </span>
            <IconButton
                display={{ base: "none", _groupHover: "flex" }}
                size={"2xs"}
                variant={"outline"}
                onClick={() =>
                    journalAdditionalInfoDrawer.open(JOURNAL_INFO_DRAWER_ID, {
                        event: row.original,
                    })
                }
            >
                <LuChevronRight />
            </IconButton>
        </div>
    );
};

export const useCreateTable = (filteredColumns, filteredData, user) => {
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
                        case "info": {
                            const value = getValue();
                            return infoCell({ value, row });
                        }
                        case "needAck": {
                            if (!getValue() || !hasRight(user, "journal.ack"))
                                return null;
                            return <AckButtonCellChakra event={row.original} />;
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
        [filteredColumns, user],
    );

    return useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row, index) => row.id ?? `${row.ts}-${index}`,
    });
};
