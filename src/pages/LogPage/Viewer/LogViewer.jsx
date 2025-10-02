import { Card, Flex } from "@chakra-ui/react";
import { LogViewerHeader } from "./Header/LogViewerHeader";
import { LogViewerBody } from "./LogViewerBody";

function LogViewer() {
    console.log("Render LogViewer");
    return (
        <Flex flex={1} minH={0} direction={"column"}>
            <Card.Root
                size={"sm"}
                shadow={"xl"}
                data-state={"open"}
                animationDuration={"slow"}
                animationStyle={{
                    _open: "scale-fade-in",
                }}
            >
                <Card.Body>
                    <LogViewerHeader />
                </Card.Body>
            </Card.Root>
            <LogViewerBody />
        </Flex>
    );
}

export default LogViewer;
