import { Group, IconButton } from "@chakra-ui/react";
import {
    LuClipboardCopy,
    LuGroup,
    LuLayers2,
    LuTrash2,
    LuX,
} from "react-icons/lu";
import { round4 } from "../utils";
import { useNodeStore } from "../store/node-store";

//TODO WIP

export const ActionsBlock = ({
    node,
    nodesRef,
    selectedIds,
    transformerRef,
}) => {
    const isMultiple = selectedIds.length > 1;
    return (
        <Group>
            <Ungroup
                node={node}
                nodesRef={nodesRef}
                selectedIds={selectedIds}
            />
            {isMultiple && (
                <GroupSelected
                    node={node}
                    nodesRef={nodesRef}
                    selectedIds={selectedIds}
                    transformerRef={transformerRef}
                />
            )}
            <IconButton size={"xs"}>
                <LuClipboardCopy />
            </IconButton>
            <IconButton size={"xs"}>
                <LuLayers2 />
            </IconButton>
            <IconButton size={"xs"} colorPalette={"red"}>
                <LuTrash2 />
            </IconButton>
        </Group>
    );
};

const GroupSelected = ({ nodesRef, selectedIds }) => {
    const handleGroup = () => {
        const bbox = calcBBox(
            selectedIds.map((id) => nodesRef.current.get(id)),
        );
        useNodeStore.getState().groupNodes(selectedIds, bbox);
    };

    return (
        <IconButton size={"xs"} onClick={handleGroup}>
            <LuGroup />
        </IconButton>
    );
};

const Ungroup = ({ selectedIds }) => {
    const handleUngroup = () => {
        useNodeStore.getState().ungroupNodes(selectedIds[0]);
    };

    return (
        <IconButton size={"xs"} onClick={handleUngroup}>
            <LuX />
        </IconButton>
    );
};

function calcBBox(nodes) {
    const minX = round4(Math.min(...nodes.map((n) => n.x())));
    const minY = round4(Math.min(...nodes.map((n) => n.y())));
    const maxX = round4(Math.max(...nodes.map((n) => n.x() + n.width())));
    const maxY = round4(Math.max(...nodes.map((n) => n.y() + n.height())));
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
