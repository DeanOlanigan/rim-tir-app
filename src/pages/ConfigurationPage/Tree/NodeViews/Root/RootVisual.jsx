import { HStack, Text } from "@chakra-ui/react";
import { RootButtons } from "./Buttons/RootButtons";

export const RootVisual = ({ node }) => {
    return (
        <HStack justify={"space-between"} w={"100%"}>
            <Text>{node.data.name || "Root Node"}</Text>
            <RootButtons treeApi={node.tree} />
        </HStack>
    );
};
