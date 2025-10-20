import { Card } from "@chakra-ui/react";
import { LogViewerHeader } from "./Header/LogViewerHeader";
import { LogViewerBody } from "./LogViewerBody";

function LogViewer() {
    return (
        <Card.Root size={"sm"} shadow={"xl"} h={"100%"}>
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
