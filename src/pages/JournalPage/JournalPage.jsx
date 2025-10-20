import { HStack } from "@chakra-ui/react";
import { JournalFilter } from "./JournalFilter/JournalFilter";
import { JournalView } from "./JournalView/JournalView";

function JournalPage() {
    console.log("Render JournalPage");
    return (
        <HStack>
            <JournalFilter />
            <JournalView />
        </HStack>
    );
}

export default JournalPage;
