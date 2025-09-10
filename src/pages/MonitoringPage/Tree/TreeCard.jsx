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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QK } from "@/api/queryKeys";
import { getConfiguration } from "@/api/configuration";
import { useCallback, useMemo } from "react";
import { useSelectionSync } from "@/store/selection-sync-store";
import { useTreeRegistry } from "@/store/tree-registry-store";

// TODO может быть сравнить с TreeCard в configuration и сделать общую функциональность
export const TreeCard = ({ type, searchTerm }) => {
    const { data = [] } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => state[type],
    });

    if (data.length === 0) return null;
    const isEmptyRoot =
        data[0].type === NODE_TYPES.root && data[0].children.length === 0;

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
                {isEmptyRoot ? (
                    <EmptyCard />
                ) : (
                    <Content
                        data={data}
                        searchTerm={searchTerm}
                        treeType={type}
                    />
                )}
            </Card.Body>
        </Card.Root>
    );
};

const Content = ({ data, searchTerm, treeType }) => {
    console.log("render content");
    const qc = useQueryClient();
    const { setApi } = useTreeRegistry.getState();

    const aliasName = useMemo(() => {
        const conf = qc.getQueryData(QK.configuration);
        const settings = conf?.state?.settings ?? {};
        const m = new Map();
        for (const id in settings) {
            const rec = settings[id];
            if (rec?.type === NODE_TYPES.dataObject) {
                const vid = rec.setting?.variableId;
                const vname = vid ? settings[vid]?.name : undefined;
                if (vname) m.set(id, vname);
            }
        }
        return m;
    }, [qc]);

    const searchMarch = useCallback(
        (node, term) => {
            if (!term) return true;
            const baseName =
                node.data.type === NODE_TYPES.dataObject
                    ? aliasName.get(node.data.id) ?? node.data.name
                    : node.data.name;

            return (
                !!baseName &&
                baseName.toLowerCase().includes(term.toLowerCase())
            );
        },
        [aliasName]
    );

    const registerApi = useCallback(
        (api) => {
            setApi("monitoring", treeType, api);
        },
        [setApi, treeType]
    );

    return (
        <AutoSizer>
            {({ height, width }) => (
                <Tree
                    ref={registerApi}
                    data={data}
                    height={height}
                    width={width}
                    className={styles.tree}
                    openByDefault={true}
                    overscanCount={2}
                    rowHeight={32}
                    indent={16}
                    searchTerm={searchTerm}
                    searchMatch={searchMarch}
                    renderCursor={DropCursor}
                    disableDrag
                    disableDrop
                    disableEdit
                    onSelect={() =>
                        useSelectionSync
                            .getState()
                            .userSelect("monitoring", treeType)
                    }
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
