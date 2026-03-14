import { Badge, HStack } from "@chakra-ui/react";
import { useJournalStream } from "../JournalStores/journal-stream-store";

export const JournalLiveHeader = () => {
    const meta = useJournalStream((s) => s.meta);

    return (
        <HStack gap={2}>
            <Badge variant="subtle">Новые: {meta.newCount ?? 0}</Badge>
            <Badge colorPalette={"blue"} variant="subtle">
                Неквитированные: {meta.unackedCount ?? 0}
            </Badge>
            <Badge colorPalette="yellow" variant="subtle">
                Предупреждения: {meta.unackedWarningCount ?? 0}
            </Badge>
            <Badge colorPalette="red" variant="subtle">
                Тревоги: {meta.unackedAlarmCount ?? 0}
            </Badge>
        </HStack>
    );
};
