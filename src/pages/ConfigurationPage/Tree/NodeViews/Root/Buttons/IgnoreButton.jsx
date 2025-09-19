import { Tooltip } from "@/components/ui/tooltip";
import { useVariablesStore } from "@/store/variables-store";
import { IconButton, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { LuBan, LuCheckCheck } from "react-icons/lu";

export const IgnoreButton = ({ treeApi }) => {
    const [ignoreMode, setIgnoreMode] = useState(false);
    const handleIgnore = (e) => {
        e.stopPropagation();
        const ids = treeApi?.root.children.map((child) => child.id);
        useVariablesStore.getState().toggleIgnore(ids);
        setIgnoreMode(!ignoreMode);
    };

    return (
        <Tooltip
            content={
                ignoreMode
                    ? "Разблокировать корневые узлы"
                    : "Заблокировать корневые узлы"
            }
        >
            <IconButton size={"2xs"} variant={"subtle"} onClick={handleIgnore}>
                {ignoreMode ? (
                    <Icon as={LuCheckCheck} color={"fg.success"} />
                ) : (
                    <Icon as={LuBan} color={"red.400"} />
                )}
            </IconButton>
        </Tooltip>
    );
};
