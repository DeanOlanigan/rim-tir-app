import {
    Box,
    createListCollection,
    Flex,
    Icon,
    Listbox,
} from "@chakra-ui/react";
import { useNodeStore } from "./store/node-store";
import {
    LuCircle,
    LuGroup,
    LuMoveUpRight,
    LuSlash,
    LuSquare,
} from "react-icons/lu";
import { useActionsStore } from "./store/actions-store";

const TYPES_ICONS = {
    rect: LuSquare,
    ellipse: LuCircle,
    line: LuSlash,
    arrow: LuMoveUpRight,
    group: LuGroup,
};

export const NodesTree = () => {
    const nodes = useNodeStore((state) => state.nodes);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const showNodesTree = useActionsStore((state) => state.showNodesTree);
    if (!showNodesTree) return null;

    const nodesList = createListCollection({
        items: nodes.map((node) => ({
            value: node.id,
            label: node.name,
            icon: TYPES_ICONS[node.type],
        })),
    });

    return (
        <Box
            bg={"bg"}
            w={"180px"}
            h={"250px"}
            borderRadius={"md"}
            shadow={"md"}
            p={2}
        >
            <Listbox.Root
                collection={nodesList}
                value={selectedIds}
                onValueChange={(details) =>
                    useNodeStore.getState().setSelectedIds(details.value)
                }
                selectionMode="extended"
                height={"100%"}
            >
                <Listbox.Label>Nodes tree</Listbox.Label>
                <Listbox.Content>
                    {nodesList.items.map((item) => (
                        <Listbox.Item item={item} key={item.value}>
                            <Flex align={"center"} gap={2}>
                                <Icon as={item.icon} />
                                <Listbox.ItemText>
                                    {item.label}
                                </Listbox.ItemText>
                            </Flex>
                            <Listbox.ItemIndicator />
                        </Listbox.Item>
                    ))}
                </Listbox.Content>
            </Listbox.Root>
        </Box>
    );
};
