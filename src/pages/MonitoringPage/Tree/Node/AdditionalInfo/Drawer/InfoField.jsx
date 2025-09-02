import { Badge, Stack, Text } from "@chakra-ui/react";

function valueResolver(context, value) {
    if (!context) return value;
    switch (context.type) {
        case "enum": {
            return context.enumValues.find(value).label;
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
        <Stack
            minW={"75px"}
            maxW={"150px"}
            /* borderRadius={"md"}
            border={"1px solid"}
            borderColor={"border"}
            p={"1"} */
        >
            <Text fontWeight={"medium"} truncate title={label}>
                {label}
            </Text>
            <Badge size={"sm"} justifyContent={"center"} variant={"surface"}>
                <Text truncate title={resolvedValue}>
                    {resolvedValue}
                </Text>
            </Badge>
        </Stack>
    );
};
