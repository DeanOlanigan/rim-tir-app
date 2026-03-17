import { RADII_MAIN } from "@/config/constants";
import {
    Badge,
    Box,
    Button,
    createListCollection,
    DatePicker,
    Field,
    Flex,
    HStack,
    Portal,
    SegmentGroup,
    Select,
    VStack,
} from "@chakra-ui/react";
import { parseDate, today } from "@internationalized/date";
import { LuCalendar } from "react-icons/lu";

export const Header = () => {
    return (
        <Flex
            px={6}
            py={2}
            gap={4}
            bg={"bg.panel"}
            borderRadius={RADII_MAIN}
            shadow={"md"}
            w={"full"}
            justify={"space-between"}
            align={"center"}
        >
            <HStack>
                <Mode />
                <DatePeriod />
                <PointLimit />
            </HStack>
            <Box>
                <Badge size={"md"}>Текущие</Badge>
            </Box>
        </Flex>
    );
};

const Mode = () => {
    return (
        <Field.Root orientation={"vertical"}>
            <Field.Label fontSize="xs" color="fg.muted">
                Режим
            </Field.Label>
            <SegmentGroup.Root size={"sm"} defaultValue="realTime">
                <SegmentGroup.Indicator bg={"colorPalette.solid"} />
                <SegmentGroup.Items
                    items={[
                        { value: "realTime", label: "Текущие" },
                        { value: "window", label: "Период" },
                    ]}
                />
            </SegmentGroup.Root>
        </Field.Root>
    );
};

const DatePeriod = () => {
    const maxDate = today();
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
                max={maxDate}
                defaultValue={[parseDate("2026-03-01"), maxDate]}
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

const points = createListCollection({
    items: [
        { label: "50", value: 50 },
        { label: "100", value: 100 },
        { label: "150", value: 150 },
        { label: "300", value: 300 },
        { label: "500", value: 500 },
        { label: "1000", value: 1000 },
    ],
});

const PointLimit = () => {
    return (
        <Field.Root orientation={"vertical"}>
            <Field.Label fontSize="xs" color="fg.muted">
                Лимит точек
            </Field.Label>
            <Select.Root
                collection={points}
                defaultValue={[150]}
                size="xs"
                w="100px"
                lazyMount
                unmountOnExit
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
                            {points.items.map((point) => (
                                <Select.Item item={point} key={point.value}>
                                    {point.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </Field.Root>
    );
};
