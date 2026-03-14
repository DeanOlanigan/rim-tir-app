export const JOURNAL_HISTORY_COLUMNS = [
    { label: "Тип", value: "type", minSize: 75, grow: 0 },
    { label: "Метка времени", value: "tsText", minSize: 170, grow: 1 },
    { label: "Событие", value: "event", minSize: 200, grow: 2 },
    { label: "Информация", value: "info", minSize: 400, grow: 3 },
    { label: "Пользователь", value: "user", minSize: 140, grow: 1 },
    {
        label: "Время квитирования",
        value: "ackTimeText",
        minSize: 170,
        grow: 1,
    },
    { label: "Квитировал", value: "who_ack", minSize: 140, grow: 1 },
    { label: "", value: "needAck", minSize: 75, grow: 0 },
];

export const JOURNAL_LIVE_COLUMNS = [
    { label: "Тип", value: "type", minSize: 75, grow: 0 },
    { label: "Метка времени", value: "tsText", minSize: 170, grow: 1 },
    { label: "Событие", value: "event", minSize: 200, grow: 2 },
    { label: "Информация", value: "info", minSize: 400, grow: 3 },
    { label: "Пользователь", value: "user", minSize: 140, grow: 1 },
    { label: "", value: "needAck", minSize: 75, grow: 0 },
];
