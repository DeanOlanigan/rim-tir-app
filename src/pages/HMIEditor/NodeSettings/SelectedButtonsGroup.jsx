import { Group, IconButton } from "@chakra-ui/react";
import {
    LuClipboardCopy,
    LuGroup,
    LuLayers2,
    LuTrash2,
    LuX,
} from "react-icons/lu";
import { calcBBox } from "../utils";
import { useNodeStore } from "../store/node-store";
import { SHAPES } from "../constants";

export const SelectedButtonsGroup = ({ ids, api, types }) => {
    const isMultiple = ids.length > 1;
    const showUngroup = types.some((type) => type === SHAPES.group);

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
    const stage = api.canvas.getStage();
    const nodes = api.canvas.getNodes();
    const handleGroup = () => {
        const gcl = ids.map((id) =>
            nodes.get(id).getClientRect({ relativeTo: stage }),
        );
        const bbox = calcBBox(gcl);
        useNodeStore.getState().groupNodes(ids, bbox);
    };

    return (
        <IconButton size={"xs"} onClick={handleGroup}>
            <LuGroup />
        </IconButton>
    );
};

const Ungroup = ({ ids }) => {
    const handleUngroup = () => {
        useNodeStore.getState().ungroupMultipleNodes(ids);
    };

    return (
        <IconButton size={"xs"} onClick={handleUngroup}>
            <LuX />
        </IconButton>
    );
};
