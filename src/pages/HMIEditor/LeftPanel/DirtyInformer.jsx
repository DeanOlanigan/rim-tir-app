import { Icon } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { LuBadgeAlert } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";

export const DirtyInformer = () => {
    const dirty = useNodeStore((s) => s.meta.isDirty);
    return (
        dirty && (
            <Tooltip content={"Несохраненные изменения"}>
                <Icon as={LuBadgeAlert} color="red.500" size={"md"} />
            </Tooltip>
        )
    );
};
