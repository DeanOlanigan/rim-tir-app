import {
    Checkmark,
    createTreeCollection,
    Icon,
    TreeView,
    useTreeViewNodeContext,
} from "@chakra-ui/react";
import { rightsSample } from "./rightsSample";
import { LuChevronRight } from "react-icons/lu";
import { useRightsAndRolesStore } from "../../SettingsStore/rights-and-roles-store";

const TreeNodeCheckbox = () => {
    const nodeState = useTreeViewNodeContext();

    return (
        <TreeView.NodeCheckbox>
            <Checkmark
                bg={{
                    base: "bg",
                    _checked: "colorPalette.solid",
                    _indeterminate: "colorPalette.solid",
                }}
                size="sm"
                checked={nodeState.checked}
                indeterminate={nodeState.checked === "indeterminate"}
            />
        </TreeView.NodeCheckbox>
    );
};

export const RoleTree = () => {
    const collection = createTreeCollection({
        nodeToValue: (node) => node.id,
        nodeToString: (node) => node.name,
        rootNode: rightsSample,
    });

    const selRights = useRightsAndRolesStore((s) => s.selectedRole.rights);
    const editSelRights = useRightsAndRolesStore.getState().editSelectedRole;

    return (
        <TreeView.Root
            collection={collection}
            checkedValue={selRights}
            onCheckedChange={(e) => {
                editSelRights(e.checkedValue, "rights");
            }}
            maxH={"xs"}
            overflow={"auto"}
        >
            <TreeView.Label>Cписок прав</TreeView.Label>
            <TreeView.Tree>
                <TreeView.Node
                    render={({ node, nodeState }) =>
                        nodeState.isBranch ? (
                            <TreeView.BranchControl role="none">
                                <TreeNodeCheckbox />
                                <TreeView.BranchText fontWeight={"medium"}>
                                    <Icon
                                        transform={
                                            nodeState.expanded
                                                ? "rotate(90deg)"
                                                : "rotate(0deg)"
                                        }
                                        transition={"transform 0.2s ease"}
                                    >
                                        <LuChevronRight />
                                    </Icon>
                                    {node.name}
                                </TreeView.BranchText>
                            </TreeView.BranchControl>
                        ) : (
                            <TreeView.Item>
                                <TreeNodeCheckbox />
                                <TreeView.ItemText>
                                    {node.name}
                                </TreeView.ItemText>
                            </TreeView.Item>
                        )
                    }
                />
            </TreeView.Tree>
        </TreeView.Root>
    );
};
