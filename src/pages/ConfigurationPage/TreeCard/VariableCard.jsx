import { Card, Box, Alert } from "@chakra-ui/react";
import { TreeView } from "../Tree/TreeView";
import { VariableCardTitle } from "./Title";
import { useRef, useState } from "react";

export const VariableCard = ({ data = [], type }) => {
    console.log("RENDER VariableCard", type);
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
                    <VariableCardTitle
                        type={type}
                        isHovered={isHovered}
                        variableTreeRef={variableTreeRef}
                    />
                </Card.Title>
            </Card.Header>
            <Card.Body px={"0"}>
                {data.length === 0 && (
                    <Box px={"4"} mb={"2"} w={"100%"}>
                        {type === "variables" && (
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
                        {(type === "send" || type === "receive") && (
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
                <TreeView ref={variableTreeRef} data={data} type={type} />
            </Card.Body>
        </Card.Root>
    );
};
