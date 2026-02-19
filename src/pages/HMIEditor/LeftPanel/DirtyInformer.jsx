import { Icon } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { LuBadgeAlert } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { LOCALE } from "../constants";

export const DirtyInformer = () => {
    const dirty = useNodeStore((s) => s.meta.isDirty);
    return (
        dirty && (
            <Tooltip showArrow content={LOCALE.unsavedChanges}>
                <Icon as={LuBadgeAlert} color="red.500" size={"md"} />
            </Tooltip>
        )
    );
};
