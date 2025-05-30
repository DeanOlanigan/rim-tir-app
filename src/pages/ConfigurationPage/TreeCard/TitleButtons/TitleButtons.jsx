import { CONSTANT_VALUES } from "@/config/constants";
import { HStack } from "@chakra-ui/react";
import { ConnectionsTitleButtons } from "./ConnectionsTitleButtons";
import { ExpandButton } from "./ExpandButton";
import { SetIgnoreBtn } from "./SetIgnoreBtn";
import { VariablesTitleButtons } from "./VariablesTitleButtons";

export const TitleButtons = ({ treeApi }) => {
    const type = treeApi.props.treeType;
    return (
        <HStack
            gap={"1"}
            opacity={"0"}
            transition={"opacity 0.2s ease-in-out"}
            _groupHover={{ opacity: 1 }}
        >
            {(type === CONSTANT_VALUES.TREE_TYPES.send ||
                type === CONSTANT_VALUES.TREE_TYPES.receive) && (
                <ConnectionsTitleButtons treeApi={treeApi} />
            )}
            {type === CONSTANT_VALUES.TREE_TYPES.variables && (
                <VariablesTitleButtons treeApi={treeApi} />
            )}
            <SetIgnoreBtn treeApi={treeApi} />
            <ExpandButton treeApi={treeApi} />
        </HStack>
    );
};
