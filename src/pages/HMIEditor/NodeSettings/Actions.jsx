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
import { SHAPES } from "../constants";

export const ActionsBlock = ({ nodesRef, ids, transformerRef, types }) => {
    const isMultiple = ids.length > 1;
    const showUngroup = types.every((type) => type === SHAPES.group);

    return (
        <Group>
            {showUngroup && <Ungroup ids={ids} />}
            {isMultiple && (
                <GroupSelected
                    nodesRef={nodesRef}
                    ids={ids}
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

const GroupSelected = ({ nodesRef, ids, transformerRef }) => {
    const transformer = transformerRef.current;
    console.log(transformer);
    const handleGroup = () => {
        // TODO считать bbox через getClientRect или transformerRef
        const bbox = calcBBox(ids.map((id) => nodesRef.current.get(id)));
        useNodeStore.getState().groupNodes(ids, bbox);
    };

    return (
        <IconButton size={"xs"} onClick={handleGroup}>
            <LuGroup />
        </IconButton>
    );
};

const Ungroup = ({ ids }) => {
    // TODO передалать для множества
    const id = ids[0];
    const handleUngroup = () => {
        useNodeStore.getState().ungroupNodes(id);
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
