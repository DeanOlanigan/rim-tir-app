import {
    Card,
    Text,
    AbsoluteCenter,
    VStack,
    Icon,
    HStack,
} from "@chakra-ui/react";
import { AutoSizer } from "react-virtualized";
import { Tree } from "react-arborist";
import styles from "@/components/TreeView/TreeView.module.css";
import { DropCursor } from "@/components/TreeView/DropCursor";
import { Node } from "./Node/Node";
import { LuFileQuestion } from "react-icons/lu";
import { NODE_TYPES } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";
import { QK } from "@/api/queryKeys";
import { getConfiguration } from "@/api/configuration";

// TODO может быть сравнить с TreeCard в configuration и сделать общую функциональность
export const TreeCard = ({ type, searchTerm }) => {
    const { data = [] } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => state[type],
    });

    let content;

    if (data.length === 0) return null;
    if (data[0].type === NODE_TYPES.root && data[0].children.length === 0) {
        content = <EmptyCard />;
    } else {
        content = <Content data={data} searchTerm={searchTerm} />;
    }

    return (
        <Card.Root
            size={"sm"}
            h={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
            border={"none"}
            bg={"transparent"}
        >
            <Card.Body px={"1"} pb={"1"}>
                {content}
            </Card.Body>
        </Card.Root>
    );
};

const Content = ({ data, searchTerm }) => {
    return (
        <AutoSizer>
            {({ height, width }) => (
                <Tree
                    data={data}
                    height={height}
                    width={width}
                    className={styles.tree}
                    openByDefault={true}
                    overscanCount={2}
                    rowHeight={32}
                    indent={16}
                    searchTerm={searchTerm}
                    searchMatch={(node, term) => {
                        const name =
                            node.data.name || node.data.setting?.variable;
                        if (!name) return false;
                        return name.toLowerCase().includes(term.toLowerCase());
                    }}
                    renderCursor={DropCursor}
                    disableDrag
                    disableDrop
                    disableEdit
                >
                    {Node}
                </Tree>
            )}
        </AutoSizer>
    );
};

const EmptyCard = () => {
    return (
        <AbsoluteCenter>
            <VStack w={"100%"}>
                <Icon
                    fontSize={"164px"}
                    color={"bg.muted"}
                    as={LuFileQuestion}
                />
                <HStack>
                    <Text color={"fg.subtle"} fontWeight={"medium"}>
                        Нет данных
                    </Text>
                </HStack>
            </VStack>
        </AbsoluteCenter>
    );
};
