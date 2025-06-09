import { Tooltip } from "@/components/ui/tooltip";
import { CONSTANT_VALUES } from "@/config/constants";
import { IconButton } from "@chakra-ui/react";
import { LuFilePlus, LuFolderPlus } from "react-icons/lu";

export const VariablesButtons = ({ treeApi }) => {
    const handleCreateVariable = (e) => {
        e.stopPropagation();
        treeApi?.create({
            parentId: null,
            type: {
                nodeType: CONSTANT_VALUES.NODE_TYPES.variable,
                times: 1,
            },
        });
    };

    const handleCreateFolder = (e) => {
        e.stopPropagation();
        treeApi?.create({
            parentId: null,
            type: {
                nodeType: CONSTANT_VALUES.NODE_TYPES.folder,
                times: 1,
            },
        });
    };

    return (
        <>
            <Tooltip content={"Создать переменную..."}>
                <IconButton
                    size={"2xs"}
                    variant={"subtle"}
                    onClick={handleCreateVariable}
                >
                    <LuFilePlus />
                </IconButton>
            </Tooltip>
            <Tooltip content={"Создать папку..."}>
                <IconButton
                    size={"2xs"}
                    variant={"subtle"}
                    onClick={handleCreateFolder}
                >
                    <LuFolderPlus />
                </IconButton>
            </Tooltip>
        </>
    );
};
