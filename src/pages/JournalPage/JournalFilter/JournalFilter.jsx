import { useState } from "react";
import { Card, CheckboxGroup, Stack, createListCollection } from "@chakra-ui/react";
import { ru } from "date-fns/locale";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot 
} from "../../../components/ui/accordion";
import { Field } from "../../../components/ui/field";
import { Switch } from "../../../components/ui/switch";
import { 
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { Button } from "../../../components/ui/button";
import { DatePicker } from "../../../components/DatePicker/DatePicker";
import "react-datepicker/dist/react-datepicker.css";
import { Fieldset } from "@chakra-ui/react";
import PropTypes from "prop-types";

function JournalFilter({ onApplyFilters }) {

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 3);
    startDate.setMinutes(Math.round(startDate.getMinutes() / 15) * 15);

    const endDate = new Date();
    endDate.setDate(endDate.getDate());
    endDate.setMinutes(Math.round(endDate.getMinutes() / 15) * 15);

    const defaultFilters = {
        archiveStartDate : true,
        archiveEndDate : true,
        columnToggle : true,
        groupsToggle : true,
        eventTypeToggle : true,
        tableIdSort : "",

        archiveToggle : true,
        mountType : "search",
        rowsCount : 200,
        archiveStartDatePick : startDate,
        archiveEndDatePick : endDate,

        columns : [
            "columnDateCheck",
            "columnTypeCheck",
            "columnVarCheck",
            "columnDescCheck",
            "columnValCheck",
            "columnGroupCheck"
        ],

        groups : [
            "groupEmptyCheck",
            "groupDangerCheck",
            "groupWarnCheck",
            "groupStateCheck"
        ],

        events : [
            "eventTypeTSCheck",
            "eventTypeTUCheck"
        ],

        variables: []
    };
    const [filters, setFilters] = useState(defaultFilters);

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

    const columns = [
        { label: "Дата и время", value: "columnDateCheck" },
        { label: "Тип", value: "columnTypeCheck" },
        { label: "Переменная", value: "columnVarCheck" },
        { label: "Описание", value: "columnDescCheck" },
        { label: "Значение", value: "columnValCheck" },
        { label: "Группа", value: "columnGroupCheck" },
    ];

    const groups = [
        { label: "Без группы", value: "groupEmptyCheck" },
        { label: "Аварийные", value: "groupDangerCheck" },
        { label: "Предупредительные", value: "groupWarnCheck" },
        { label: "Оперативного состояния", value: "groupStateCheck" },
    ];

    const messageTypes = [
        { label: "ТС", value: "eventTypeTSCheck" },
        { label: "Пользовательские ТУ", value: "eventTypeTUCheck" },
    ];

    const mountType = createListCollection({
        items: [
            { label: "SD карта", value: "sd" },
            { label: "Внутренняя память", value: "r" },
            { label: "Искать", value: "search" },
        ],
    });

    const handleApply = () => {
        onApplyFilters(filters);
    };

    const handleReset = () => {
        setFilters(defaultFilters);
        onApplyFilters(defaultFilters);
    };

    return (
        <Card.Root
            w={"100%"}
            maxH={"100%"}
            flexShrink={"1"}
            flexGrow={"1"}
            shadow={"xl"}
            data-state={"open"}
            overflow={"hidden"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <Card.Title>Фильтры</Card.Title>
            </Card.Header>
            <Card.Body gap={"2"} flex={"1"} display={"flex"} py={"1"} my={"1.5rem"}
                overflow={"auto"} flexDirection={"column"} minH={"0"}>
                
                <AccordionRoot multiple size={"sm"}>
                    <AccordionItem value="1">
                        <AccordionItemTrigger>Архив</AccordionItemTrigger>
                        <AccordionItemContent>
                            <Stack p={"1"}>
                                <Field orientation="horizontal" label="Архив">
                                    <Switch
                                        size={"sm"}
                                        checked={filters.archiveToggle}
                                        onCheckedChange={(e)=> setFilters({...filters, archiveToggle: e.checked})}
                                    />
                                </Field>
                                <DatePicker
                                    selected={filters.archiveStartDatePick}
                                    portalId="datepicker-portal"
                                    popperPlacement="right-start"
                                    showPopperArrow={false}
                                    disabled={!filters.archiveToggle}
                                    onChange={(date) => setFilters({...filters, archiveStartDatePick: date})}
                                    locale={ru}
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
                                <DatePicker
                                    selected={filters.archiveEndDatePick}
                                    portalId="datepicker-portal"
                                    popperPlacement="right-start"
                                    showPopperArrow={false}
                                    disabled={!filters.archiveToggle}
                                    onChange={(date) => setFilters({...filters, archiveEndDatePick: date})}
                                    locale={ru}
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
                                <SelectRoot
                                    disabled={!filters.archiveToggle}
                                    collection={rows}
                                    size={"xs"}
                                    value={[filters.rowsCount.toString()]}
                                    onValueChange={(value) => setFilters({...filters, rowsCount: parseInt(value.value[0])})}
                                >
                                    <SelectLabel>Количество строк:</SelectLabel>
                                    <SelectTrigger>
                                        <SelectValueText/>
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
                                    onValueChange={(value) => setFilters({...filters, mountType: value.value[0]})}
                                >
                                    <SelectLabel>Поиск:</SelectLabel>
                                    <SelectTrigger>
                                        <SelectValueText/>
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
                        </AccordionItemContent>
                    </AccordionItem>
                    <AccordionItem value="2">
                        <AccordionItemTrigger>Столбцы</AccordionItemTrigger>
                        <AccordionItemContent>
                            <Fieldset.Root invalid={filters.columns.length === 0}>
                                <Fieldset.Content>
                                    <Stack p={"1"}>
                                        <CheckboxGroup
                                            invalid={filters.columns.length === 0}
                                            value={filters.columns}
                                            onValueChange={(value) => setFilters({...filters, columns: value})}
                                        >
                                            {columns.map((column) => (
                                                <Checkbox key={column.value} value={column.value}>{column.label}</Checkbox>
                                            ))}
                                        </CheckboxGroup>
                                    </Stack>
                                </Fieldset.Content>
                                <Fieldset.ErrorText>
                                    Выберите хотя бы один столбец
                                </Fieldset.ErrorText>
                            </Fieldset.Root>
                        </AccordionItemContent>
                    </AccordionItem>
                    <AccordionItem value="3">
                        <AccordionItemTrigger>Группы</AccordionItemTrigger>
                        <AccordionItemContent>
                            <Stack p={"1"}>
                                <CheckboxGroup 
                                    value={filters.groups}
                                    onValueChange={(value) => setFilters({...filters, groups: value})}
                                >
                                    {groups.map((group) => (
                                        <Checkbox key={group.value} value={group.value}>{group.label}</Checkbox>
                                    ))}
                                </CheckboxGroup>
                            </Stack>
                        </AccordionItemContent>
                    </AccordionItem>
                    <AccordionItem value="4">
                        <AccordionItemTrigger>Типы сообщений</AccordionItemTrigger>
                        <AccordionItemContent>
                            <Stack p={"1"}>
                                <CheckboxGroup
                                    value={filters.events}
                                    onValueChange={(types) => setFilters({...filters, events: types})}
                                >
                                    {messageTypes.map((type) => (
                                        <Checkbox key={type.value} value={type.value}>{type.label}</Checkbox>
                                    ))}
                                </CheckboxGroup>
                            </Stack>
                        </AccordionItemContent>
                    </AccordionItem>
                </AccordionRoot>
                <SelectRoot
                    collection={rows}
                    size={"xs"}
                    multiple
                    onValueChange={(value) => setFilters({...filters, variables: value.value})}
                    value={filters.variables}
                >
                    <SelectLabel>Переменные:</SelectLabel>
                    <SelectTrigger clearable>
                        <SelectValueText placeholder="Выберите переменные" />
                    </SelectTrigger>
                    <SelectContent>
                        {rows.items.map((row) => (
                            <SelectItem item={row} key={row.value}>
                                {row.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectRoot>
            </Card.Body>
            <Card.Footer justifyContent={"space-between"}>
                <Button size={"xs"} disabled={!filters.columns.length} onClick={handleApply}>Применить</Button>
                <Button size={"xs"} onClick={handleReset}>Сбросить</Button>
            </Card.Footer>
        </Card.Root>
    );
}
JournalFilter.propTypes = {
    onApplyFilters: PropTypes.func,
};

export default JournalFilter;
