import { Container, HStack } from "@chakra-ui/react";
import { JournalView } from "./JournalView/JournalView";
import { JournalFilterDeux } from "./JournalFilter/JournalFilterDeux"

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
                <JournalFilterDeux />
                <JournalView />
            </HStack>
        </Container>
    );
}

export default JournalPage;