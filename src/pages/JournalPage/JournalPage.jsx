import { Box, Flex } from "@chakra-ui/react";
import { JournalFilter } from "./JournalFilter/JournalFilter";
import { JournalView } from "./JournalView/JournalView";

function JournalPage() {
    return (
        <Box
            flex={1}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Flex gap={"2"} h={"100%"} w={"100%"}>
                <JournalFilter />
                <JournalView />
            </Flex>
        </Box>
    );
}

export default JournalPage;
