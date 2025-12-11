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

export const ActionsBlock = ({ ids, api, types }) => {
    const isMultiple = ids.length > 1;
    const showUngroup = types.every((type) => type === SHAPES.group);

    const handleDelete = () => {
        useNodeStore.getState().removeNodes(ids);
    };

    const handleDuplicate = () => {
        useNodeStore.getState().duplicateNodes(ids);
    };

    return (
        <Group>
            {showUngroup && <Ungroup ids={ids} />}
            {isMultiple && <GroupSelected ids={ids} api={api} />}
            <IconButton size={"xs"} disabled>
                <LuClipboardCopy />
            </IconButton>
            <IconButton size={"xs"} onClick={handleDuplicate}>
                <LuLayers2 />
            </IconButton>
            <IconButton size={"xs"} colorPalette={"red"} onClick={handleDelete}>
                <LuTrash2 />
            </IconButton>
        </Group>
    );
};

const GroupSelected = ({ ids, api }) => {
    const transformer = api.canvas.getTransformer();
    console.log(transformer);
    const handleGroup = () => {
        // TODO считать bbox через getClientRect или transformerRef
        const bbox = calcBBox(ids.map((id) => api.canvas.getNodes().get(id)));
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
