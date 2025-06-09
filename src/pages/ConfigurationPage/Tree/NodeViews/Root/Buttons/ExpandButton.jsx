import { Tooltip } from "@/components/ui/tooltip";
import { IconButton, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { LuCopyPlus, LuCopyMinus } from "react-icons/lu";

export const ExpandButton = ({ treeApi }) => {
    const [expanded, setExpanded] = useState(
        treeApi.isOpen(treeApi.props.treeType)
    );

    const handleExpand = (e) => {
        e.stopPropagation();
        if (expanded) {
            treeApi?.closeAll();
        } else {
            treeApi?.openAll();
        }
        setExpanded(!expanded);
    };

    return (
        <Tooltip
            content={expanded ? "Свернуть все узлы" : "Развернуть все узлы"}
        >
            <IconButton size={"2xs"} variant={"subtle"} onClick={handleExpand}>
                <Icon
                    size={"sm"}
                    transform={"scaleX(-1)"}
                    as={expanded ? LuCopyMinus : LuCopyPlus}
                />
            </IconButton>
        </Tooltip>
    );
};
