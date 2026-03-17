import { VStack } from "@chakra-ui/react";
import { JournalHistoryHeader } from "./JournalView/JournalHistoryHeader";
import { JournalHistoryTable } from "./JournalHistoryTable";

function JournalPage() {
    return (
        <VStack
            w="full"
            h={"full"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
            gap={4}
        >
            <JournalHistoryHeader />
            <JournalHistoryTable />
        </VStack>
    );
}

export default JournalPage;
