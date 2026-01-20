import { Text, VStack } from "@chakra-ui/react";

export const DirectEditor = ({ config }) => {
    return (
        <VStack align="start" gap={2} p={2} bg="bg.subtle" borderRadius="md">
            <Text fontSize="xs" color="fg.muted">
                The raw value from the variable will be passed directly to the
                <Text as="span" fontWeight="bold">{` ${config.label} `}</Text>
                property.
            </Text>
            {config.type === "color" && (
                <Text fontSize="xs" color="orange.500">
                    ⚠️ Ensure the variable contains a valid hex string (e.g.
                    &quot;#ff0000&quot;).
                </Text>
            )}
        </VStack>
    );
};
