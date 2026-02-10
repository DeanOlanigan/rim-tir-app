import { Text, VStack } from "@chakra-ui/react";
import { LOCALE } from "../../constants";

export const DirectEditor = ({ config }) => {
    return (
        <VStack align="start" gap={2} p={2} bg="bg.subtle" borderRadius="md">
            <Text fontSize="xs" color="fg.muted">
                {LOCALE.directEditorDesc}
                <Text as="span" fontWeight="bold">{` ${config.label} `}</Text>
            </Text>
            {config.type === "color" && (
                <Text fontSize="xs" color="orange.500">
                    {LOCALE.directEditorColorWarn}
                </Text>
            )}
        </VStack>
    );
};
