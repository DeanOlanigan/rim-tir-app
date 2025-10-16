import { Container, HStack } from "@chakra-ui/react";
import { JournalFilter } from "./JournalFilter/JournalFilter";
import { JournalView } from "./JournalView/JournalView";

function JournalPage() {
    console.log("Render JournalPage");
    return (
        <Container
            maxW={"6xl"}
            flex={"1"}
            display={"flex"}
            flexDirection={"column"}
            minH={"0"}
            gap={"2"}
        >
            <HStack
                w={"100%"}
                flex={"1"}
                display={"flex"}
                flexDirection={"row"}
                align={"flex-start"}
                minH={"0"}
                position={"relative"}
            >
                <JournalFilter />
                <JournalView />
            </HStack>
        </Container>
    );
}

export default JournalPage;
