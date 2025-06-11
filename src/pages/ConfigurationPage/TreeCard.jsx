import {
    Card,
    AbsoluteCenter,
    Icon,
    Text,
    Kbd,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { TreeView } from "./Tree/TreeView";
import { memo } from "react";
import { LuBadgePlus } from "react-icons/lu";
import { CONSTANT_VALUES } from "@/config/constants";

// TODO МБ использовать slot паттерн
export const TreeCard = memo(function TreeCard({ data = [], treeType }) {
    console.log("RENDER VariableCard", treeType);
    const isEmpty =
        data[0].type === CONSTANT_VALUES.NODE_TYPES.root &&
        data[0].children.length === 0;
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
            <Card.Body px={"0"} overflow={"hidden"}>
                {isEmpty && <EmptyCard />}
                <TreeView data={data} treeType={treeType} />
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
