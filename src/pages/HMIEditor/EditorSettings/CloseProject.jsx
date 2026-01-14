import { IconButton } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { LuX } from "react-icons/lu";
import { AreYouShureDialog } from "@/components/AreYouShureDialog";

export const CloseProject = () => {
    const closeHandler = () => {
        useNodeStore.setState({
            rootIds: [],
            nodes: {},
            selectedIds: [],
        });
    };

    return (
        <AreYouShureDialog
            onAccept={closeHandler}
            header={"Закрыть проект?"}
            message={"Все несохранённые данные будут потеряны."}
        >
            <IconButton size={"xs"} variant={"surface"}>
                <LuX />
            </IconButton>
        </AreYouShureDialog>
    );
};
