import { VStack } from "@chakra-ui/react";
import { Header } from "./Header";
import { DataSets } from "./DataSets";
import { GraphBlock } from "./GraphBlock";

function GraphPageNew() {
    return (
        <VStack
            w={"full"}
            h={"full"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
            gap={4}
        >
            <Header />
            <DataSets />
            <GraphBlock />
        </VStack>
    );
}

export default GraphPageNew;
