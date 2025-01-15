import { createListCollection } from "@chakra-ui/react";

export const messageTypes = [
    { label: "ТС", value: "eventTypeTSCheck" },
    { label: "Пользовательские ТУ", value: "eventTypeTUCheck" },
];

export const groups = [
    { label: "Без группы", value: "groupEmptyCheck" },
    { label: "Аварийные", value: "groupDangerCheck" },
    { label: "Предупредительные", value: "groupWarnCheck" },
    { label: "Оперативного состояния", value: "groupStateCheck" },
];

export const tableColumns = [
    { label: "Дата и время", value: "date" },
    { label: "Тип", value: "type" },
    { label: "Переменная", value: "var" },
    { label: "Описание", value: "desc" },
    { label: "Значение", value: "val" },
    { label: "Группа", value: "group" },
];

export const rows = createListCollection({
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

export const mountType = createListCollection({
    items: [
        { label: "SD карта", value: "sd" },
        { label: "Внутренняя память", value: "r" },
        { label: "Искать", value: "search" },
    ],
});

const startDate = new Date();
startDate.setDate(startDate.getDate() - 3);
startDate.setMinutes(Math.round(startDate.getMinutes() / 15) * 15);

const endDate = new Date();
endDate.setDate(endDate.getDate());
endDate.setMinutes(Math.round(endDate.getMinutes() / 15) * 15);

export const defaultFilters = {
    archiveToggle : true,
    mountType : "search",
    rowsCount : 50,
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

    variables: [],

    // Убрать
    archiveStartDate : true,
    archiveEndDate : true,
    columnToggle : true,
    groupsToggle : true,
    eventTypeToggle : true,
    tableIdSort : "",
};
