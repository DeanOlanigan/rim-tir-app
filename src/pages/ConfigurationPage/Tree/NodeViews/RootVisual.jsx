import { HStack, Text } from "@chakra-ui/react";
import { TitleButtons } from "../../TreeCard/TitleButtons/TitleButtons";

export const RootVisual = ({ node }) => {
    console.log(node);
    return (
        <HStack justify={"space-between"} w={"100%"}>
            <Text>{node.data.name || "Root Node"}</Text>
            <TitleButtons type={node.tree.props.treeType} treeApi={node.tree} />
        </HStack>
    );
};
