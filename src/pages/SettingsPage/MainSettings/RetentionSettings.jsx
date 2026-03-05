import { useAuth } from "@/hooks/useAuth";
import { hasRight } from "@/utils/permissions";
import { Heading, SimpleGrid } from "@chakra-ui/react";
import { RETENTION_KEYS, RETENTION_META } from "./settings.schema";
import { RetentionPolicyCard } from "./RetentionPolicyCard";

export const RetentionSettings = () => {
    const { user } = useAuth();
    return (
        <>
            <Heading>Хранение данных</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                {RETENTION_KEYS.map((key) => {
                    const meta = RETENTION_META[key];
                    if (!hasRight(user, meta.right)) return null;

                    return (
                        <RetentionPolicyCard
                            key={key}
                            label={meta.label}
                            name={key}
                        />
                    );
                })}
            </SimpleGrid>
        </>
    );
};
