import {
    Button,
    DatePicker,
    HStack,
    Input,
    Portal,
    Stack,
    Text,
} from "@chakra-ui/react";
import { LuCalendar } from "react-icons/lu";
import { useMemo, useState } from "react";
import {
    CalendarDateTime,
    DateFormatter,
    getLocalTimeZone,
} from "@internationalized/date";

const tz = getLocalTimeZone();

const fmt = new DateFormatter("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
});

function pad2(n) {
    return String(n ?? 0).padStart(2, "0");
}

function timeToHM(value) {
    // "HH:MM" -> { hour, minute }
    const [h, m] = (value || "").split(":").map((x) => Number(x));
    return {
        hour: Number.isFinite(h) ? h : 0,
        minute: Number.isFinite(m) ? m : 0,
    };
}

function makeCDTFromDateValue(dateValue, time, fallbackYear = 2026) {
    // dateValue тут из DatePicker: обычно CalendarDate (year/month/day)
    // time: {hour, minute}
    if (!dateValue) return null;
    return new CalendarDateTime(
        dateValue.year ?? fallbackYear,
        dateValue.month ?? 1,
        dateValue.day ?? 1,
        time.hour ?? 0,
        time.minute ?? 0,
    );
}

export const PeriodPicker = () => {
    // eslint-disable-next-line
    /* const startDate = useGraphStore((state) => state.startDate);
    const endDate = useGraphStore((state) => state.endDate);
    const setStartDate = useGraphStore.getState().setStartDate;
    const setEndDate = useGraphStore.getState().setEndDate; */

    const [value, setValue] = useState([]);

    // отдельно храним время для start/end (чтобы не терять при смене даты)
    const [startTime, setStartTime] = useState({ hour: 0, minute: 0 });
    const [endTime, setEndTime] = useState({ hour: 23, minute: 59 });

    // что показывать в кнопке
    const displayText = useMemo(() => {
        if (!value.length) return "Выбрать период";
        if (value.length === 1) return `С: ${fmt.format(value[0].toDate(tz))}`;
        return `С: ${fmt.format(value[0].toDate(tz))} — По: ${fmt.format(value[1].toDate(tz))}`;
    }, [value]);

    // DatePicker отдаёт DateValue[] (обычно 0..2 элемента)
    const onDateChange = (details) => {
        const dates = details.value || [];
        const start = makeCDTFromDateValue(dates[0], startTime);
        const end = makeCDTFromDateValue(dates[1], endTime);

        // если выбран только старт — держим массив длины 1
        setValue([start, end].filter(Boolean));
    };

    const onStartTimeChange = (e) => {
        const hm = timeToHM(e.currentTarget.value);
        setStartTime(hm);

        setValue((prev) => {
            const start = prev[0];
            if (!start) return prev;
            const nextStart = start.set({ hour: hm.hour, minute: hm.minute });
            return [nextStart, prev[1]].filter(Boolean);
        });
    };

    const onEndTimeChange = (e) => {
        const hm = timeToHM(e.currentTarget.value);
        setEndTime(hm);

        setValue((prev) => {
            const end = prev[1];
            if (!end) return prev; // конец еще не выбран
            const nextEnd = end.set({ hour: hm.hour, minute: hm.minute });
            return [prev[0], nextEnd].filter(Boolean);
        });
    };

    return (
        <Stack gap="3" maxW="28rem" align="flex-start">
            <Text textStyle="sm" color="fg.muted">
                Значение (CalendarDateTime[]):{" "}
                {value.length
                    ? value.map((v) => v.toString()).join(" | ")
                    : "—"}
            </Text>

            <DatePicker.Root
                size={"xs"}
                selectionMode="range"
                value={value} // контролируем DatePicker
                onValueChange={onDateChange}
                closeOnSelect={false} // удобно, чтобы успеть выбрать время
                timeZone={tz} // важно для format/toDate
                maxWidth="28rem"
            >
                <DatePicker.Label>Период</DatePicker.Label>

                <DatePicker.Control>
                    {/* Кнопка-триггер вместо инпутов (можно и с Input index={0/1}, как в доках) */}
                    <DatePicker.Trigger asChild unstyled>
                        <Button
                            size={"xs"}
                            variant="outline"
                            width="full"
                            justifyContent="space-between"
                            fontSize={"xs"}
                        >
                            {displayText}
                            <LuCalendar />
                        </Button>
                    </DatePicker.Trigger>
                </DatePicker.Control>

                <Portal>
                    <DatePicker.Positioner>
                        <DatePicker.Content>
                            <DatePicker.View view="day">
                                <DatePicker.Header />
                                <DatePicker.DayTable />

                                {/* Время для start/end */}
                                <HStack pt="3">
                                    <Stack flex="1" gap="1">
                                        <Text textStyle="xs" color="fg.muted">
                                            С
                                        </Text>
                                        <Input
                                            size={"xs"}
                                            type="time"
                                            value={`${pad2(startTime.hour)}:${pad2(startTime.minute)}`}
                                            onChange={onStartTimeChange}
                                        />
                                    </Stack>
                                    <Stack flex="1" gap="1">
                                        <Text textStyle="xs" color="fg.muted">
                                            По
                                        </Text>
                                        <Input
                                            size={"xs"}
                                            type="time"
                                            value={`${pad2(endTime.hour)}:${pad2(endTime.minute)}`}
                                            onChange={onEndTimeChange}
                                            disabled={value.length < 2} // пока нет end — нет смысла править end time
                                        />
                                    </Stack>
                                </HStack>
                            </DatePicker.View>

                            <DatePicker.View view="month">
                                <DatePicker.Header />
                                <DatePicker.MonthTable />
                            </DatePicker.View>

                            <DatePicker.View view="year">
                                <DatePicker.Header />
                                <DatePicker.YearTable />
                            </DatePicker.View>
                        </DatePicker.Content>
                    </DatePicker.Positioner>
                </Portal>
            </DatePicker.Root>
        </Stack>
    );
};
