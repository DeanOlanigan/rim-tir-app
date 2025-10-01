import { Card } from "@chakra-ui/react";
import { LogViewerHeader } from "./Header/LogViewerHeader";
import { LogViewerBody } from "./LogViewerBody";

function LogViewer() {
    console.log("Render LogViewer");
    return (
        <Card.Root
            flex={"1"}
            display={"flex"}
            flexDirection={"column"}
            minH={"0"}
            shadow={"xl"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <LogViewerHeader />
            </Card.Header>

            <Card.Body
                flex={"1"}
                display={"flex"}
                flexDirection={"column"}
                minH={"0"}
            >
                <LogViewerBody />
            </Card.Body>
        </Card.Root>
    );
}

export default LogViewer;
