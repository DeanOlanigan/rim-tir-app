import { HStack, Text } from "@chakra-ui/react";

export function BaseVisual({
    editor = null,
    name,
    nameRenderer = (name) => (name ? <Text>{name}</Text> : null),
    isEditing = false,
}) {
    return (
        // TODO Разобраться с truncate, сделать чтобы текст обрезался как в vscode
        <HStack w={"100%"} minW={0} truncate>
            {isEditing && editor}
            {!isEditing && <Text truncate>{name}</Text> && nameRenderer(name)}
        </HStack>
    );
}
