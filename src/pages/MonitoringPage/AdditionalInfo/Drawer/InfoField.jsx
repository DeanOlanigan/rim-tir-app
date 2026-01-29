import { DataList } from "@chakra-ui/react";

function valueResolver(context, value) {
    if (!context) return value;
    switch (context.type) {
        case "enum": {
            const enumVal = context.enumValues.find(
                (val) => val.value === value,
            );
            return enumVal.value;
        }
        case "boolean":
            return value ? "Да" : "Нет";
        default:
            return value;
    }
}

export const InfoField = ({ param, value, config }) => {
    if (
        ["description", "luaExpression", "variableId", "usedIn"].includes(param)
    )
        return null;

    const label = config.settings[param]?.label;
    const resolvedValue = valueResolver(config.settings[param], value);

    return (
        <DataList.Item>
            <DataList.ItemLabel>{label}</DataList.ItemLabel>
            <DataList.ItemValue>{resolvedValue}</DataList.ItemValue>
        </DataList.Item>
    );
};
