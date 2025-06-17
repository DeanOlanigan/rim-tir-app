import {
    Card,
    Text,
    AbsoluteCenter,
    VStack,
    Icon,
    HStack,
    Spinner,
} from "@chakra-ui/react";
import { AutoSizer } from "react-virtualized";
import { Tree } from "react-arborist";
import styles from "@/components/TreeView/TreeView.module.css";
import { DropCursor } from "@/components/TreeView/DropCursor";
import { Node } from "./Tree/Node";
import { LuCircleAlert } from "react-icons/lu";
import { CONSTANT_VALUES } from "@/config/constants";

// TODO может быть сравнить с TreeCard в configuration и сделать общую функциональность
export const TreeCard = ({ data = [], searchTerm, isLoading, error }) => {
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
            <Card.Body px={"1"} pb={"1"}>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Error />
                ) : data[0].type === CONSTANT_VALUES.NODE_TYPES.root &&
                  data[0].children.length === 0 ? (
                    <EmptyCard />
                ) : (
                    <Content data={data} searchTerm={searchTerm} />
                )}
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

const Loader = () => {
    return (
        <AbsoluteCenter>
            <VStack w={"100%"}>
                <Spinner size={"lg"} />
                <HStack>
                    <Text color={"fg.subtle"} fontWeight={"medium"}>
                        Загрузка...
                    </Text>
                </HStack>
            </VStack>
        </AbsoluteCenter>
    );
};

const Error = () => {
    return (
        <AbsoluteCenter>
            <VStack w={"100%"}>
                <Icon
                    fontSize={"164px"}
                    color={"fg.error"}
                    as={LuCircleAlert}
                />
                <HStack>
                    <Text color={"fg.error"} fontWeight={"medium"}>
                        Ошибка загрузки
                    </Text>
                </HStack>
            </VStack>
        </AbsoluteCenter>
    );
};
