import { Icon, Spinner } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { LuBadgeAlert, LuBadgeCheck } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { LOCALE } from "../constants";
import { useMutationState } from "@tanstack/react-query";

export const ProjectStatusInformer = () => {
    const dirty = useNodeStore((s) => s.meta.isDirty);
    const mode = useNodeStore((s) => s.meta.mode);

    const saveMutation = useMutationState({
        filters: {
            mutationKey: ["saveHmiProject"],
            status: "pending",
        },
        select: (m) => m.state.variables,
    });
    const isSaving = saveMutation.length > 0;

    let color;
    switch (mode) {
        case "new":
            color = "fg.muted";
            break;
        case "local":
            color = "fg.info";
            break;
        case "server":
            color = "fg.success";
            break;
    }
    color = dirty ? "fg.error" : color;

    let tooltipText;
    switch (mode) {
        case "new":
            tooltipText = "Новый проект";
            break;
        case "local":
            tooltipText = "Проект сохранён локально";
            break;
        case "server":
            tooltipText = "Проект сохранён на сервере";
            break;
    }
    tooltipText = dirty ? LOCALE.unsavedChanges : tooltipText;

    return isSaving ? (
        <Spinner size={"md"} color={color} />
    ) : (
        <Tooltip showArrow content={tooltipText}>
            <Icon
                as={dirty ? LuBadgeAlert : LuBadgeCheck}
                color={color}
                size={"md"}
            />
        </Tooltip>
    );
};
