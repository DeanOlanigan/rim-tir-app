import { createListCollection, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import "react-datepicker/dist/react-datepicker.css";

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

function ArchiveFilter({ filters, setFilters }) {
    console.log("Render ArchiveFilter");
    return (
        <Stack p={"1"}>
            <Field orientation="horizontal" label="Архив">
                <Switch
                    size={"sm"}
                    checked={filters.archiveToggle}
                    onCheckedChange={(e) =>
                        setFilters({ ...filters, archiveToggle: e.checked })
                    }
                />
            </Field>
            <Field label="Дата начала" disabled={!filters.archiveToggle}>
                <DatePicker
                    selected={filters.archiveStartDatePick}
                    portalId="datepicker-portal"
                    popperPlacement="right-start"
                    showPopperArrow={false}
                    disabled={!filters.archiveToggle}
                    onChange={(date) =>
                        setFilters({ ...filters, archiveStartDatePick: date })
                    }
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
            </Field>
            <Field label="Дата окончания" disabled={!filters.archiveToggle}>
                <DatePicker
                    selected={filters.archiveEndDatePick}
                    portalId="datepicker-portal"
                    popperPlacement="right-start"
                    showPopperArrow={false}
                    disabled={!filters.archiveToggle}
                    onChange={(date) =>
                        setFilters({ ...filters, archiveEndDatePick: date })
                    }
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
            </Field>
            <SelectRoot
                disabled={!filters.archiveToggle}
                collection={rows}
                size={"xs"}
                value={[filters.rowsCount.toString()]}
                onValueChange={(value) =>
                    setFilters({
                        ...filters,
                        rowsCount: parseInt(value.value[0]),
                    })
                }
            >
                <SelectLabel>Количество строк:</SelectLabel>
                <SelectTrigger>
                    <SelectValueText />
                </SelectTrigger>
                <SelectContent>
                    {rows.items.map((row) => (
                        <SelectItem item={row} key={row.value}>
                            {row.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>
            <SelectRoot
                disabled={!filters.archiveToggle}
                collection={mountType}
                size={"xs"}
                value={[filters.mountType]}
                onValueChange={(value) =>
                    setFilters({ ...filters, mountType: value.value[0] })
                }
            >
                <SelectLabel>Расположение:</SelectLabel>
                <SelectTrigger>
                    <SelectValueText />
                </SelectTrigger>
                <SelectContent>
                    {mountType.items.map((type) => (
                        <SelectItem item={type} key={type.value}>
                            {type.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>
        </Stack>
    );
}

export default ArchiveFilter;
