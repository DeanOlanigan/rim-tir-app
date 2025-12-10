import { Tree } from "react-arborist";
import styles from "@/components/TreeView/TreeView.module.css";
import { DropCursor } from "@/components/TreeView/DropCursor";
import { Node } from "./Node/Node";
import { useCallback } from "react";
import { useSelectionSync } from "@/store/selection-sync-store";
import { useTreeRegistry } from "@/store/tree-registry-store";
import { useSearchMatch } from "./useSearchMatch";

export const TreeView = ({
    data,
    searchTerm,
    treeType,
    width = 500,
    height = 900,
}) => {
    const registerApi = useCallback(
        (api) => {
            useTreeRegistry.getState().setApi("monitoring", treeType, api);
        },
        [treeType],
    );

    const searchMatch = useSearchMatch();

    return (
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
            searchMatch={searchMatch}
            renderCursor={DropCursor}
            disableDrag
            disableDrop
            disableEdit
            onSelect={() =>
                useSelectionSync.getState().userSelect("monitoring", treeType)
            }
        >
            {Node}
        </Tree>
    );
};
