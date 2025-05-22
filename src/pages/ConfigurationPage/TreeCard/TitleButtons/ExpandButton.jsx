import { Tooltip } from "@/components/ui/tooltip";
import { IconButton, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { LuCopyPlus, LuCopyMinus } from "react-icons/lu";

export const ExpandButton = ({ variableTreeRef }) => {
    const [expanded, setExpanded] = useState(false);
    const handleExpand = () => {
        if (expanded) {
            variableTreeRef?.current.openAll();
        } else {
            variableTreeRef?.current.closeAll();
        }
        setExpanded(!expanded);
    };

    return (
        <Tooltip
            content={expanded ? "Развернуть все узлы" : "Свернуть все узлы"}
        >
            <IconButton size={"2xs"} variant={"subtle"} onClick={handleExpand}>
                <Icon
                    size={"sm"}
                    transform={"scaleX(-1)"}
                    as={expanded ? LuCopyPlus : LuCopyMinus}
                />
            </IconButton>
        </Tooltip>
    );
};
