import { CanAccess } from "@/CanAccess";
import {
    Button,
    DatePicker,
    DownloadTrigger,
    Field,
    Flex,
    HStack,
    Menu,
    Portal,
    VStack,
} from "@chakra-ui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { LuCalendar, LuChevronDown, LuDownload } from "react-icons/lu";
import { useJournalHistoryStore } from "../JournalStores/journal-history-store";
import { useEffect, useMemo, useState } from "react";
import { journalFiltersToApiPayload } from "../journal-history-period";
import { RADII_MAIN } from "@/config/constants";
import { downloadJournal } from "@/api/routes/journal.api";

const SEVERITY_FILTER_ITEMS = [
    { label: "Критическая", value: "critical" },
    { label: "Тревога", value: "error" },
    { label: "Предупреждение", value: "warning" },
    { label: "Информация", value: "info" },
];

const CATEGORY_FILTER_ITEMS = [
    { label: "Переменная", value: "variable" },
    { label: "Пользователь", value: "user" },
    { label: "Событие", value: "event" },
    { label: "Конфигурация", value: "config" },
    { label: "HMI", value: "hmi" },
    { label: "Сервер", value: "server" },
    { label: "Настройки", value: "settings" },
    { label: "Безопасность", value: "security" },
    { label: "Система", value: "system" },
];

function toggleInArray(list, value) {
    return list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
}

function filtersToLocalState(filters) {
    return {
        period: {
            from: filters?.period?.from ?? null,
            to: filters?.period?.to ?? null,
        },
        severity: Array.isArray(filters?.severity) ? filters.severity : [],
        category: Array.isArray(filters?.category) ? filters.category : [],
    };
}

function periodToPickerValue(period) {
    const from = period?.from ?? null;
    const to = period?.to ?? null;

    if (!from && !to) return [];
    if (from && !to) return [from];
    if (!from && to) return [to];
    return [from, to];
}

export const JournalHistoryHeader = () => {
    const appliedFilters = useJournalHistoryStore((s) => s.filters);
    const setFilters = useJournalHistoryStore((s) => s.setFilters);

    const [localFilters, setLocalFilters] = useState(() =>
        filtersToLocalState(appliedFilters),
    );

    useEffect(() => {
        setLocalFilters(filtersToLocalState(appliedFilters));
    }, [appliedFilters]);

    const canApply =
        localFilters.period.from &&
        localFilters.period.to &&
        localFilters.period.from.compare(localFilters.period.to) <= 0;

    const handleApply = () => {
        if (!canApply) return;

        setFilters({
            period: {
                from: localFilters.period.from,
                to: localFilters.period.to,
            },
            severity: localFilters.severity,
            category: localFilters.category,
        });
    };

    const fetchData = async () => {
        const filters = journalFiltersToApiPayload(appliedFilters);

        return await downloadJournal({
            fromUTC: filters.from,
            toUTC: filters.to,
            severity: filters.severity,
            category: filters.category,
        });
    };

    const handlePeriodChange = (details) => {
        const [from, to] = Array.isArray(details?.value) ? details.value : [];

        setLocalFilters((prev) => ({
            ...prev,
            period: {
                from: from ?? null,
                to: to ?? null,
            },
        }));
    };

    return (
        <HStack
            w={"full"}
            px={6}
            py={2}
            bg={"bg.panel"}
            borderRadius={RADII_MAIN}
            shadow={"md"}
        >
            <HStack align={"end"}>
                <SeverityMenu
                    value={localFilters.severity}
                    onToggle={(value) =>
                        setLocalFilters((prev) => ({
                            ...prev,
                            severity: toggleInArray(prev.severity, value),
                        }))
                    }
                />
                <CategoryMenu
                    value={localFilters.category}
                    onToggle={(value) =>
                        setLocalFilters((prev) => ({
                            ...prev,
                            category: toggleInArray(prev.category, value),
                        }))
                    }
                />
                <DatePeriod
                    value={localFilters.period}
                    onChange={handlePeriodChange}
                />
                <Button
                    variant="solid"
                    size="xs"
                    onClick={handleApply}
                    disabled={!canApply}
                    aria-label="Применить фильтры"
                >
                    Применить фильтры
                </Button>
                <CanAccess right="journal.download">
                    <DownloadTrigger
                        data={fetchData}
                        fileName={`journal_export_${new Date().toISOString()}.csv`}
                        mimeType="text/csv"
                        asChild
                    >
                        <Button size="xs" aria-label="Экспорт в CSV">
                            <LuDownload />
                            Экспорт в CSV
                        </Button>
                    </DownloadTrigger>
                </CanAccess>
            </HStack>
        </HStack>
    );
};

const DatePeriod = ({ value, onChange }) => {
    const tz = getLocalTimeZone();
    const pickerValue = useMemo(() => periodToPickerValue(value), [value]);
    const maxDate = today(tz);
    return (
        <Field.Root orientation={"vertical"}>
            <Field.Label fontSize="xs" color="fg.muted">
                Период
            </Field.Label>
            <DatePicker.Root
                selectionMode="range"
                maxWidth="20rem"
                size={"xs"}
                locale="ru-RU"
                timezone={tz}
                max={maxDate}
                value={pickerValue}
                onValueChange={onChange}
                lazyMount
                unmountOnExit
            >
                <DatePicker.Control>
                    <DatePicker.Input index={0} placeholder="С" />
                    <DatePicker.Input index={1} placeholder="По" />
                    <DatePicker.IndicatorGroup>
                        <DatePicker.Trigger>
                            <LuCalendar />
                        </DatePicker.Trigger>
                    </DatePicker.IndicatorGroup>
                </DatePicker.Control>
                <Portal>
                    <DatePicker.Positioner>
                        <DatePicker.Content>
                            <Flex gap="6">
                                <Flex direction="column" flex="1" minW={0}>
                                    <DatePicker.View view="day">
                                        <DatePicker.Header />
                                        <DatePicker.DayTable />
                                    </DatePicker.View>
                                    <DatePicker.View view="month">
                                        <DatePicker.Header />
                                        <DatePicker.MonthTable />
                                    </DatePicker.View>
                                    <DatePicker.View view="year">
                                        <DatePicker.Header />
                                        <DatePicker.YearTable />
                                    </DatePicker.View>
                                </Flex>
                                <VStack
                                    align="stretch"
                                    gap="2"
                                    minW="140px"
                                    height="100%"
                                >
                                    <DatePicker.PresetTrigger
                                        value="last3Days"
                                        asChild
                                    >
                                        <Button
                                            variant="surface"
                                            size="xs"
                                            width="100%"
                                        >
                                            Последние 3 дня
                                        </Button>
                                    </DatePicker.PresetTrigger>
                                    <DatePicker.PresetTrigger
                                        value="last7Days"
                                        asChild
                                    >
                                        <Button
                                            variant="surface"
                                            size="xs"
                                            width="100%"
                                        >
                                            Последние 7 дней
                                        </Button>
                                    </DatePicker.PresetTrigger>
                                    <DatePicker.PresetTrigger
                                        value="thisWeek"
                                        asChild
                                    >
                                        <Button
                                            variant="surface"
                                            size="xs"
                                            width="100%"
                                        >
                                            Эта неделя
                                        </Button>
                                    </DatePicker.PresetTrigger>
                                    <DatePicker.PresetTrigger
                                        value="lastWeek"
                                        asChild
                                    >
                                        <Button
                                            variant="surface"
                                            size="xs"
                                            width="100%"
                                        >
                                            Прошлая неделя
                                        </Button>
                                    </DatePicker.PresetTrigger>
                                    <DatePicker.PresetTrigger
                                        value="last30Days"
                                        asChild
                                    >
                                        <Button
                                            variant="surface"
                                            size="xs"
                                            width="100%"
                                        >
                                            Последние 30 дней
                                        </Button>
                                    </DatePicker.PresetTrigger>
                                    <DatePicker.PresetTrigger
                                        value="thisMonth"
                                        asChild
                                    >
                                        <Button
                                            variant="surface"
                                            size="xs"
                                            width="100%"
                                        >
                                            Этот месяц
                                        </Button>
                                    </DatePicker.PresetTrigger>
                                    <DatePicker.PresetTrigger
                                        value="lastMonth"
                                        asChild
                                    >
                                        <Button
                                            variant="surface"
                                            size="xs"
                                            width="100%"
                                        >
                                            Прошлый месяц
                                        </Button>
                                    </DatePicker.PresetTrigger>
                                </VStack>
                            </Flex>
                        </DatePicker.Content>
                    </DatePicker.Positioner>
                </Portal>
            </DatePicker.Root>
        </Field.Root>
    );
};

const SeverityMenu = ({ value, onToggle }) => {
    return (
        <Menu.Root closeOnSelect={false} lazyMount unmountOnExit size="sm">
            <Menu.Trigger asChild>
                <Button size={"xs"} gap={4}>
                    Тип
                    <LuChevronDown />
                </Button>
            </Menu.Trigger>

            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup>
                            {SEVERITY_FILTER_ITEMS.map((item) => {
                                const checked = value.includes(item.value);

                                return (
                                    <Menu.CheckboxItem
                                        key={item.value}
                                        value={item.value}
                                        checked={checked}
                                        onCheckedChange={() =>
                                            onToggle(item.value)
                                        }
                                    >
                                        {item.label}
                                        <Menu.ItemIndicator />
                                    </Menu.CheckboxItem>
                                );
                            })}
                        </Menu.ItemGroup>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

const CategoryMenu = ({ value, onToggle }) => {
    return (
        <Menu.Root closeOnSelect={false} lazyMount unmountOnExit size="sm">
            <Menu.Trigger asChild>
                <Button size={"xs"} gap={4}>
                    Категория
                    <LuChevronDown />
                </Button>
            </Menu.Trigger>

            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup>
                            {CATEGORY_FILTER_ITEMS.map((item) => {
                                const checked = value.includes(item.value);

                                return (
                                    <Menu.CheckboxItem
                                        key={item.value}
                                        value={item.value}
                                        checked={checked}
                                        onCheckedChange={() =>
                                            onToggle(item.value)
                                        }
                                    >
                                        {item.label}
                                        <Menu.ItemIndicator />
                                    </Menu.CheckboxItem>
                                );
                            })}
                        </Menu.ItemGroup>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
