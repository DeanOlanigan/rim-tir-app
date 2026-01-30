import { IconButton } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { LuX } from "react-icons/lu";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";

export const CloseProject = () => {
    const closeHandler = () => {
        useNodeStore.getState().close();
    };

    return (
        <IconButton
            size={"xs"}
            variant={"surface"}
            onClick={() =>
                confirmDialog.open(CONFIRM_DIALOG_ID, {
                    onAccept: closeHandler,
                    title: "Закрыть проект?",
                    message: "Все несохранённые данные будут потеряны.",
                })
            }
        >
            <LuX />
        </IconButton>
    );
};
