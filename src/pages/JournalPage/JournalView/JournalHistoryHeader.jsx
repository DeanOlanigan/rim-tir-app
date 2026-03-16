import { CanAccess } from "@/CanAccess";
import {
    Button,
    createListCollection,
    DatePicker,
    Field,
    Flex,
    HStack,
    IconButton,
    Menu,
    Portal,
    Select,
    VStack,
} from "@chakra-ui/react";
import { now } from "@internationalized/date";
import { useState } from "react";
import { LuCalendar, LuCheck, LuChevronDown, LuDownload } from "react-icons/lu";
import { useJournalHistoryStore } from "../JournalStores/journal-history-store";

export const JournalHistoryHeader = () => {
    return (
        <HStack justifyContent={"space-between"}>
            <HStack>
                <CanAccess right={"journal.download"}>
                    <IconButton variant={"outline"} size={"xs"}>
                        <LuDownload />
                    </IconButton>
                </CanAccess>
            </HStack>
            <HStack>
                <SeverityMenu />
                <CategoryMenu />
                <LimitSelect />
                <DatePriod />
            </HStack>
        </HStack>
    );
};

const limits = createListCollection({
    items: [
        { label: "25", value: 25 },
        { label: "50", value: 50 },
        { label: "75", value: 75 },
        { label: "100", value: 100 },
        { label: "150", value: 150 },
        { label: "300", value: 300 },
    ],
});

const LimitSelect = () => {
    const limit = useJournalHistoryStore((s) => s.limit);
    const setLimit = useJournalHistoryStore((s) => s.setLimit);

    return (
        <Select.Root
            value={[limit]}
            onValueChange={(e) => setLimit(e.value[0])}
            collection={limits}
            size="xs"
            width="150px"
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Выберите лимит" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {limits.items.map((limit) => (
                            <Select.Item item={limit} key={limit.value}>
                                {limit.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

const DatePriod = () => {
    const setPeriod = useJournalHistoryStore((s) => s.setPeriod);

    const today = now();
    const threeDaysAgo = today.subtract({ days: 3 });

    const [value, setValue] = useState([threeDaysAgo, today]);

    const handleApply = () => {
        const from = value[0].toAbsoluteString();
        const to = value[1].toAbsoluteString();

        if (!from || !to) return;

        setPeriod({ from, to });
    };

    return (
        <HStack>
            <Field.Root orientation="horizontal">
                <Field.Label fontSize="sm">Период</Field.Label>
                <DatePicker.Root
                    selectionMode="range"
                    maxWidth="20rem"
                    size={"xs"}
                    locale="ru-RU"
                    max={today}
                    value={value}
                    onValueChange={(e) => setValue(e.value)}
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
            <IconButton variant={"outline"} size={"xs"} onClick={handleApply}>
                <LuCheck />
            </IconButton>
        </HStack>
    );
};

const TYPE_FILTER_ITEMS = [
    { label: "Критическая", value: "critical" },
    { label: "Тревога", value: "error" },
    { label: "Предупреждение", value: "warning" },
    { label: "Информация", value: "info" },
];

const SeverityMenu = () => {
    const severity = useJournalHistoryStore((s) => s.severity);
    const toggleSeverity = useJournalHistoryStore((s) => s.toggleSeverity);
    return (
        <Menu.Root closeOnSelect={false} lazyMount unmountOnExit size="sm">
            <Menu.Trigger asChild>
                <Button
                    size={"xs"}
                    variant={"outline"}
                    colorPalette={"gray"}
                    gap={4}
                >
                    Тип
                    <LuChevronDown />
                </Button>
            </Menu.Trigger>

            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup>
                            {TYPE_FILTER_ITEMS.map(({ value, label }) => (
                                <Menu.CheckboxItem
                                    key={value}
                                    value={value}
                                    checked={severity.has(value)}
                                    onCheckedChange={() =>
                                        toggleSeverity(value)
                                    }
                                >
                                    {label}
                                    <Menu.ItemIndicator />
                                </Menu.CheckboxItem>
                            ))}
                        </Menu.ItemGroup>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

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

const CategoryMenu = () => {
    const category = useJournalHistoryStore((s) => s.category);
    const toggleCategory = useJournalHistoryStore((s) => s.toggleCategory);
    return (
        <Menu.Root closeOnSelect={false} lazyMount unmountOnExit size="sm">
            <Menu.Trigger asChild>
                <Button
                    size={"xs"}
                    variant={"outline"}
                    colorPalette={"gray"}
                    gap={4}
                >
                    Категория
                    <LuChevronDown />
                </Button>
            </Menu.Trigger>

            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup>
                            {CATEGORY_FILTER_ITEMS.map(({ value, label }) => (
                                <Menu.CheckboxItem
                                    key={value}
                                    value={value}
                                    checked={category.has(value)}
                                    onCheckedChange={() =>
                                        toggleCategory(value)
                                    }
                                >
                                    {label}
                                    <Menu.ItemIndicator />
                                </Menu.CheckboxItem>
                            ))}
                        </Menu.ItemGroup>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
