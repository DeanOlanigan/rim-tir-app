import { CONSTANT_VALUES } from "@/config/constants";
import { HStack } from "@chakra-ui/react";
import { ConnectionsButtons } from "./ConnectionsButtons";
import { ExpandButton } from "./ExpandButton";
import { IgnoreButton } from "./IgnoreButton";
import { VariablesButtons } from "./VariablesButtons";

export const RootButtons = ({ treeApi }) => {
    const type = treeApi.props.treeType;
    return (
        <HStack
            gap={"1"}
            opacity={"0"}
            display={{ base: "none", _groupHover: "flex" }}
            /* transition={"opacity 0.2s ease-in-out"} */
            _groupHover={{ opacity: 1 }}
        >
            {(type === CONSTANT_VALUES.TREE_TYPES.send ||
                type === CONSTANT_VALUES.TREE_TYPES.receive) && (
                <ConnectionsButtons treeApi={treeApi} type={type} />
            )}
            {type === CONSTANT_VALUES.TREE_TYPES.variables && (
                <VariablesButtons treeApi={treeApi} />
            )}
            <IgnoreButton treeApi={treeApi} />
            <ExpandButton treeApi={treeApi} />
        </HStack>
    );
};
