import { Flex } from "@chakra-ui/react";
import { JournalTable } from "./JournalView/JournalTable";
import { JournalHeader } from "./JournalView/JournalHeader";

function JournalPage() {
    return (
        <Flex
            gap={"2"}
            h={"100%"}
            w={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
            direction={"column"}
            p={4}
            bg={"bg.panel"}
            borderRadius={"lg"}
            shadow={"lg"}
        >
            <JournalHeader />
            <JournalTable />
        </Flex>
    );
}

export default JournalPage;
