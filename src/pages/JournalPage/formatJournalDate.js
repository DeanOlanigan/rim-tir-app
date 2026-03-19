const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    fractionalSecondDigits: 3,
});

export function formatJournalDate(value) {
    if (!value) return "";
    return dateFormatter.format(new Date(value));
}
