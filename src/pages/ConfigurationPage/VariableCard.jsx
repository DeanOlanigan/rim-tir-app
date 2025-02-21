import { Card, Box, Button, Text, Group } from "@chakra-ui/react";
import { AutoSizer } from "react-virtualized";
import { LuFolder, LuVariable } from "react-icons/lu";
import { TreeView } from "./Tree/TreeView";
import { useVariablesStore } from "../../store/variables-store";
import { useRef, useCallback } from "react";
import { v4 as uuid4 } from "uuid";

export const VariableCard = () => {
    const variableTreeRef = useRef(null);
    const variables = useVariablesStore((state) => state.variables);
    const setSelectedIds = useVariablesStore((state) => state.setSelectedIds);
    const setSettings = useVariablesStore((state) => state.setSettings);

    const addNode = useVariablesStore((state) => state.addNode);
    const updateNode = useVariablesStore((state) => state.updateNode);
    const removeNode = useVariablesStore((state) => state.removeNode);
    const moveNode = useVariablesStore((state) => state.moveNode);

    const handleRename = ({ id, name }) => {
        console.log("store bef", variables);
        console.log("rename", id, name);
        updateNode(id, { name });
    };

    // Формируй данные перед отправкой в стор, иначе дерево ебланит
    const handleCreate = ({ parentId, index, type }) => {
        if (type === "leaf" || type === "internal") return;
        console.log("create", parentId, index, type);
        if (type === "folder") {
            const id = uuid4();
            const node = {
                id: id,
                type: "folder",
                name: "Новая папка",
                ignoreChildren: false,
                children: [],
            };
            const setting = {
                id: id,
                description: "Описание",
                group: "",
                alias: "",
                tags: [],
            };
            addNode(parentId, node);
            setSettings(node.id, setting);
            return node;
        }
        if (type === "variable") {
            const id = uuid4();
            const node = {
                id: id,
                type: "variable",
                name: "Новая переменная",
            };
            const setting = {
                id: id,
                isSpecial: false,
                type: "bit",
                isLua: false,
                description: "Lorem ipsum dolor sit amet consectetur",
                cmd: true,
                archive: true,
                group: "noGroup",
                measurement: null,
                coefficient: "",
                luaExpression: "",
                specialCycleDelay: null
            };
            addNode(parentId, node);
            setSettings(node.id, setting);
            return node;
        }
    };

    const handleDelete = ({ ids }) => {
        console.log("delete", ids);
        removeNode(ids);
    };

    const handleMove = ({ dragIds, parentId, index }) => {
        console.log("move", dragIds, parentId, index);
        moveNode(dragIds, parentId, index);
    };

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
                {variables.length === 0 && (
                    <Box mb={"2"} w={"100%"}>
                        <Box ps={"4"} mb={"2"}>
                            <Text>Переменная еще не создана</Text>
                        </Box>
                        <Group grow>
                            <Button
                                size={"xs"}
                                onClick={() => {
                                    console.log(
                                        variableTreeRef.current,
                                        variables
                                    );
                                    variableTreeRef.current.create({
                                        type: "variable",
                                    });
                                }}
                            >
                                <LuVariable />
                                Создать переменную
                            </Button>
                            <Button
                                size={"xs"}
                                onClick={() => {
                                    console.log(
                                        variableTreeRef.current,
                                        variables
                                    );
                                    variableTreeRef.current.create({
                                        type: "folder",
                                    });
                                }}
                            >
                                <LuFolder />
                                Создать папку
                            </Button>
                        </Group>
                    </Box>
                )}
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
                                    onSelect={() => {
                                        if (variableTreeRef.current.selectedIds.size === 0) {
                                            variableTreeRef.current.focus();
                                        };
                                        setSelectedIds(variableTreeRef.current.selectedIds);
                                    }}
                                    ref={variableTreeRef}
                                    onCreate={handleCreate}
                                    onDelete={handleDelete}
                                    onRename={handleRename}
                                    onMove={handleMove}
                                />
                            )}
                        </AutoSizer>
                    </Box>
                </Box>
            </Card.Body>
        </Card.Root>
    );
};
