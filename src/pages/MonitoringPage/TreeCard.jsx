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
import { Node } from "./Tree/Node";
import { LuCircleAlert } from "react-icons/lu";

// TODO может быть сравнить с TreeCard в configuration и сделать общую функциональность
export const TreeCard = ({ data = [], title, searchTerm }) => {
    return (
        <Card.Root
            h={"100%"}
            size={"sm"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <Card.Title>{title}</Card.Title>
            </Card.Header>
            <Card.Body px={"1"} pb={"1"}>
                {data.length === 0 && <EmptyCard />}
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
                                    node.data.name ||
                                    node.data.setting?.variable;
                                if (!name) return false;
                                return name
                                    .toLowerCase()
                                    .includes(term.toLowerCase());
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
            </Card.Body>
        </Card.Root>
    );
};

const EmptyCard = () => {
    return (
        <AbsoluteCenter>
            <VStack w={"100%"}>
                <Icon
                    fontSize={"164px"}
                    color={"bg.muted"}
                    as={LuCircleAlert}
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
