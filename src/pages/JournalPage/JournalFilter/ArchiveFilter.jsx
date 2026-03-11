import {
    createListCollection,
    Field,
    Select,
    Stack,
    Switch,
} from "@chakra-ui/react";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import { useFilterStore } from "../JournalStores/filter-store";

const rows = createListCollection({
    items: [
        { label: "10", value: "10" },
        { label: "20", value: "20" },
        { label: "50", value: "50" },
        { label: "100", value: "100" },
        { label: "200", value: "200" },
        { label: "500", value: "500" },
        { label: "1000", value: "1000" },
    ],
});

const mountType = createListCollection({
    items: [
        { label: "SD карта", value: "sd" },
        { label: "Внутренняя память", value: "r" },
        { label: "Искать", value: "search" },
    ],
});

export const ArchiveFilter = () => {
    const {
        setArchive,
        chooseStartDate,
        chooseEndDate,
        setStringQuantity,
        chooseLocation,
        startDate,
        isArchive,
        endDate,
        stringsQuantity,
        location,
    } = useFilterStore();

    return (
        <Stack p={"1"}>
            <Switch.Root
                defaultChecked={isArchive}
                checked={isArchive}
                size={"sm"}
                onCheckedChange={(data) => setArchive(data.checked)}
            >
                <Switch.Label>Архив</Switch.Label>
                <Switch.HiddenInput />
                <Switch.Control />
            </Switch.Root>

            <Field.Root>
                <Field.Label>Дата начала</Field.Label>
                <DatePicker
                    selected={new Date(startDate)}
                    portalId="datepicker-portal"
                    popperPlacement="right-start"
                    showPopperArrow={false}
                    onChange={(date) => chooseStartDate(date)}
                    timeFormat="HH:mm"
                    timeCaption="Время"
                    timeIntervals={15}
                    showTimeSelect={true}
                    dateFormat={"yyyy-MM-dd HH:mm"}
                    datePickerSize="xs"
                    inputProps={{
                        size: "xs",
                    }}
                    rootProps={{
                        p: "2px",
                    }}
                    isClearable
                    placeholderText="Дата начала"
                />
            </Field.Root>

            <Field.Root>
                <Field.Label>Дата окончания</Field.Label>
                <DatePicker
                    selected={new Date(endDate)}
                    portalId="datepicker-portal"
                    popperPlacement="right-start"
                    showPopperArrow={false}
                    onChange={(date) => chooseEndDate(date)}
                    timeFormat="HH:mm"
                    timeCaption="Время"
                    timeIntervals={15}
                    showTimeSelect={true}
                    dateFormat={"yyyy-MM-dd HH:mm"}
                    datePickerSize="xs"
                    inputProps={{
                        size: "xs",
                    }}
                    rootProps={{
                        p: "2px",
                    }}
                    isClearable
                    placeholderText="Дата окончания"
                />
            </Field.Root>

            <Select.Root
                value={stringsQuantity.value}
                collection={rows}
                size={"xs"}
                onValueChange={(value) => setStringQuantity(value.value)}
            >
                <Select.HiddenSelect />
                <Select.Label>Количество строк:</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                    <Select.Content>
                        {rows.items.map((row) => (
                            <Select.Item item={row} key={row.value}>
                                {row.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Select.Root>
            <Select.Root
                value={location.value}
                collection={mountType}
                size={"xs"}
                onValueChange={(value) => chooseLocation(value.value)}
            >
                <Select.HiddenSelect />
                <Select.Label>Расположение:</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                    <Select.Content>
                        {mountType.items.map((type) => (
                            <Select.Item item={type} key={type.value}>
                                {type.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Select.Root>
        </Stack>
    );
};
