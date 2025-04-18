export function selectSelectedData(settings, selectedIds) {
    return Array.from(selectedIds)
        .map((key) => settings[key])
        .filter(Boolean);
    //.reverse();
}
