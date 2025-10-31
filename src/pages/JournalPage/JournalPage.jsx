import { Flex } from "@chakra-ui/react";
import { JournalView } from "./JournalView/JournalView";

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
        >
            <JournalView />
        </Flex>
    );
}

export default JournalPage;
