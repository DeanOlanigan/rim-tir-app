import { Card } from "@chakra-ui/react";
import { LogViewerHeader } from "./Header/LogViewerHeader";
import { LogViewerBody } from "./LogViewerBody";

function LogViewer() {
    return (
        <Card.Root
            size={"sm"}
            shadow={"md"}
            h={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{ _open: "scale-fade-in" }}
        >
            <Card.Header>
                <LogViewerHeader />
            </Card.Header>
            <Card.Body overflow={"hidden"} minH={0}>
                <LogViewerBody />
            </Card.Body>
        </Card.Root>
    );
}
export default LogViewer;
