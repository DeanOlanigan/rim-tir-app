import {
    Card,
    AbsoluteCenter,
    Icon,
    Text,
    Kbd,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { TreeView } from "../Tree/TreeView";
import { TreeCardTitle } from "./Title";
import { useRef, memo } from "react";
import { LuBadgePlus } from "react-icons/lu";

// TODO МБ использовать slot паттерн

export const TreeCard = memo(function TreeCard({ data = [], treeType }) {
    console.log("RENDER VariableCard", treeType);
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
            className="group"
            border={"none"}
            bg={"transparent"}
        >
            <Card.Header>
                <Card.Title>
                    <TreeCardTitle
                        type={treeType}
                        variableTreeRef={variableTreeRef}
                    />
                </Card.Title>
            </Card.Header>
            <Card.Body px={"0"} overflow={"hidden"}>
                {data.length === 0 && <EmptyCard />}
                <TreeView
                    ref={variableTreeRef}
                    data={data}
                    treeType={treeType}
                />
            </Card.Body>
        </Card.Root>
    );
});

const EmptyCard = () => {
    return (
        <AbsoluteCenter>
            <VStack w={"100%"}>
                <Icon fontSize={"164px"} color={"bg.muted"} as={LuBadgePlus} />
                <HStack>
                    <Text color={"fg.subtle"} fontWeight={"medium"}>
                        Открыть контекстное меню
                    </Text>
                    <Kbd>ПКМ</Kbd>
                </HStack>
            </VStack>
        </AbsoluteCenter>
    );
};
