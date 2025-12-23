import {
    Box,
    createListCollection,
    Flex,
    Icon,
    Listbox,
} from "@chakra-ui/react";
import { useNodeStore } from "./store/node-store";
import { useActionsStore } from "./store/actions-store";
import { SHAPES_ICONS } from "./constants";
import { flyToNode } from "./flyToNode";
import { useEffect, useRef, useState } from "react";

/* const useNodesData = () => {
    const rootIds = useNodeStore((state) => state.rootIds);
    if (rootIds.length === 0) return [];
    function createRecursiveList(items) {
        return items.map((id) => {
            const node = useNodeStore.getState().nodes[id];
            const res = {
                id,
                name: `${node.name} (${id})`,
                icon: SHAPES_ICONS[node.type],
            };
            if (node.childrenIds)
                res.children = createRecursiveList(node.childrenIds);
            return res;
        });
    }

    return createRecursiveList(rootIds);
}; */

export const NodesTree = ({ api }) => {
    const tweenRef = useRef(null);
    const rootIds = useNodeStore((state) => state.rootIds);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const showNodesTree = useActionsStore((state) => state.showNodesTree);
    if (!showNodesTree) return null;

    const nodesList = createListCollection({
        items: rootIds.map((id) => {
            const node = useNodeStore.getState().nodes[id];
            return {
                value: node.id,
                label: node.name,
                icon: SHAPES_ICONS[node.type],
            };
        }),
    });

    const focusById = (id) => {
        const stage = api.getStage();
        if (!stage) return;

        // 1) если у ноды есть id как attrs.id

        const node = api.getNodes().get(id);
        if (!node) return;

        flyToNode(stage, node, { tweenRef, zoomToFit: true, duration: 0.35 });
        // или zoomToFit: true, чтобы еще и приблизить/отдалить
    };

    return (
        <Box
            bg={"bg"}
            w={"250px"}
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
                            <Flex align={"center"} gap={2} w={"100%"}>
                                <Icon
                                    as={item.icon}
                                    onDoubleClick={() => focusById(item.value)}
                                />
                                <ItemName item={item} />
                            </Flex>
                            <Listbox.ItemIndicator />
                        </Listbox.Item>
                    ))}
                </Listbox.Content>
            </Listbox.Root>
        </Box>
    );
};

const ItemName = ({ item }) => {
    const [isEditing, setIsEditing] = useState(false);
    const name = useNodeStore((state) => state.nodes[item.value].name);

    return isEditing ? (
        <ItemNameEditor
            id={item.value}
            name={name}
            setIsEditing={setIsEditing}
        />
    ) : (
        <Listbox.ItemText onDoubleClick={() => setIsEditing(true)}>
            {name}
        </Listbox.ItemText>
    );
};

const ItemNameEditor = ({ id, name, setIsEditing }) => {
    const [value, setValue] = useState(name);

    useEffect(() => {
        setValue(name);
    }, [name]);

    const commit = () => {
        const next = value.trim();
        if (!next) {
            setIsEditing(name);
            setIsEditing(false);
            return;
        }
        if (next !== name) {
            const store = useNodeStore.getState();
            store.updateNode(id, { name: next });
        }
        setIsEditing(false);
    };

    const cancel = () => {
        setValue(name);
        setIsEditing(false);
    };

    return (
        <input
            size={"3xs"}
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") cancel();
            }}
            onDoubleClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        />
    );
};
