import { Card, Box, Alert } from "@chakra-ui/react";
import { TreeView } from "../Tree/TreeView";
import { TreeCardTitle } from "./Title";
import { useRef, useState, memo } from "react";

export const TreeCard = memo(function TreeCard({ data = [], treeType }) {
    console.log("RENDER VariableCard", treeType);
    const [isHovered, setIsHovered] = useState(false);

    const variableTreeRef = useRef(null);

    return (
        <Card.Root
            size={"sm"}
            h={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card.Header>
                <Card.Title>
                    <TreeCardTitle
                        type={treeType}
                        isHovered={isHovered}
                        variableTreeRef={variableTreeRef}
                    />
                </Card.Title>
            </Card.Header>
            <Card.Body px={"0"}>
                {data.length === 0 && (
                    <Box px={"4"} mb={"2"} w={"100%"}>
                        {treeType === "variables" && (
                            <Alert.Root status="info">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>
                                        Переменные еще не созданы
                                    </Alert.Title>
                                    <Alert.Description>
                                        Начните создавать переменные
                                    </Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}
                        {(treeType === "send" || treeType === "receive") && (
                            <Alert.Root status="info">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title>
                                        Информационный объект еще не создан
                                    </Alert.Title>
                                    <Alert.Description>
                                        Начните создавать информационные объекты
                                    </Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}
                    </Box>
                )}
                <TreeView
                    ref={variableTreeRef}
                    data={data}
                    treeType={treeType}
                />
            </Card.Body>
        </Card.Root>
    );
});
