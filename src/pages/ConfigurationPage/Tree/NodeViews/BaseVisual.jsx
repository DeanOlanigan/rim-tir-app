import { Badge, HStack, Text } from "@chakra-ui/react";

export function BaseVisual({
    paramValues = [],
    editor = null,
    name = "",
    renderValue = (value, index) => (
        <Badge key={index} variant="outline">
            {value}
        </Badge>
    ),
    nameRenderer = (name) => (name ? <Text>{name}</Text> : null),
    isEditing = false,
}) {
    if (!paramValues.length && !name && !isEditing) return null;

    return (
        <HStack w="100%">
            {paramValues.map((value, index) => renderValue(value, index))}
            {isEditing && editor}
            {!isEditing && name && nameRenderer(name)}
        </HStack>
    );
}
