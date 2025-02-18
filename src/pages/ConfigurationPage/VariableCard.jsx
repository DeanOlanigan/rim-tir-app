import { Card, Box, Button, Text } from "@chakra-ui/react";
import { AutoSizer } from "react-virtualized";
import {
    MenuRoot,
    MenuItem,
    MenuContent,
    MenuItemGroup,
    MenuContextTrigger
} from "../../components/ui/menu";
import { LuFolder, LuPlus, LuVariable } from "react-icons/lu";
import { TreeView } from "./Tree/TreeView";
import { useVariablesStore } from "../../store/variables-store";
import { useRef, useCallback } from "react";

export const VariableCard = () => {
    
    const variables = useVariablesStore((state) => state.variables);
    const selectedNodeId = useVariablesStore((state) => state.selectedNode);
    const setSelectedNodeId = useVariablesStore((state) => state.setSelectedNode);
    const addNode = useVariablesStore((state) => state.addNode);
    const updateNode = useVariablesStore((state) => state.updateNode);

    const variableTreeRef = useRef(null);

    const handleRename = ({ id, name }) => {
        console.log("rename", id, name);
        updateNode(id, { name });
    };

    const handleCreate = useCallback(({ parentId, index, type }) => {
        if (type === "leaf" || type === "internal") return;
        console.log("create", parentId, index, type);
        if (type === "folder") {
            const node = {
                id: Date.now().toString(),
                type: "folder",
                subType: null,
                name: "Новая папка",
                ignoreChildren: false,
                setting: {
                    /* Примерное содержимое */
                    description: "",
                    group: "",
                    alias: "",
                    tags: [],
                },
                children: [],
            };
            addNode(parentId, node, index);
            return node;
        }
        if (type === "variable") {
            const node = {
                id: Date.now().toString(),
                type: "variable",
                subType: null,
                name: "Новая переменная",
                setting: {
                    isSpecial: false,
                    type: "bit",
                    isLua: false,
                    description: "Измените описание переменной",
                    cmd: true,
                    archive: true,
                    group: "noGroup",
                    measurement: null,
                    coefficient: 1,
                    luaExpression: "",
                    specialCycleDelay: null,
                },
            };
            addNode(parentId, node, index);
            return node;
        }
    }, [addNode]);

    return (
        <Card.Root
            size={"sm"}
            h={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <Card.Title>Переменные</Card.Title>
            </Card.Header>
            <Card.Body>
                <Box>
                    <Button
                        size={"xs"}
                        w={"100%"}
                        mb={"4"}
                        onClick={() => {
                            console.log(
                                variableTreeRef.current,
                                variables,
                                selectedNodeId
                            );
                        }}
                    >
                        <LuPlus />
                        Создать
                    </Button>
                    {variables.length === 0 && (
                        <Box p={"4"}>
                            <Text>Переменная еще не создана</Text>
                        </Box>
                    )}
                </Box>
                <MenuRoot>
                    <MenuContextTrigger w={"100%"} h={"100%"}>
                        <Box
                            w={"100%"}
                            h={"100%"}
                            border={"2px dotted"}
                            borderColor={"border.info"}
                            borderRadius={"sm"}
                            p={"1"}
                        >
                            <Box w={"100%"} h={"100%"}>
                                <AutoSizer>
                                    {({ height, width }) => (
                                        <TreeView
                                            height={height}
                                            width={width}
                                            data={variables}
                                            onSelect={(node) => {
                                                const data = node.map(
                                                    (node) => {
                                                        return node.data;
                                                    }
                                                );
                                                setSelectedNodeId(data);
                                            }}
                                            ref={variableTreeRef}
                                            onRename={handleRename}
                                            onCreate={handleCreate}
                                        />
                                    )}
                                </AutoSizer>
                            </Box>
                        </Box>
                    </MenuContextTrigger>
                    <MenuContent>
                        <MenuItemGroup title="Создать">
                            <MenuItem
                                value="variable"
                                onClick={() => {
                                    variableTreeRef.current.create({
                                        type: "variable",
                                    });
                                }}
                            >
                                <LuVariable />
                                Переменная
                            </MenuItem>
                            <MenuItem
                                value="folder"
                                onClick={() => {
                                    variableTreeRef.current.create({
                                        type: "folder",
                                    });
                                }}
                            >
                                <LuFolder />
                                Папка
                            </MenuItem>
                        </MenuItemGroup>
                    </MenuContent>
                </MenuRoot>
            </Card.Body>
        </Card.Root>
    );
};
