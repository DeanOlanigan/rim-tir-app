import { Badge, HStack, Icon, Text } from "@chakra-ui/react";
import { LuCheck, LuX } from "react-icons/lu";

export function BaseVisual({
    paramValues = [],
    editor = null,
    name = "",
    renderValue = (key, value) => (
        <Badge
            key={key}
            title={key}
            variant="surface"
            size={"xs"}
            colorPalette={
                typeof value === "boolean" ? (value ? "green" : "red") : "gray"
            }
        >
            {typeof value === "boolean" ? (
                <Icon as={value ? LuCheck : LuX} />
            ) : (
                value
            )}
        </Badge>
    ),
    nameRenderer = (name) => (name ? <Text>{name}</Text> : null),
    isEditing = false,
}) {
    if (!paramValues.length && !name && !isEditing) return null;

    return (
        // TODO Разобраться с truncate, сделать чтобы текст обрезался как в vscode
        <HStack w={"100%"} minW={0} truncate>
            {Object.entries(paramValues).map(([key, value]) =>
                renderValue(key, value)
            )}
            {isEditing && editor}
            {!isEditing && <Text truncate>{name}</Text> && nameRenderer(name)}
        </HStack>
    );
}
