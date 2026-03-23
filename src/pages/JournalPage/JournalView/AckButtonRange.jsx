import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import { Tooltip } from "@/components/ui/tooltip";
import { IconButton } from "@chakra-ui/react";
import { LuCheckCheck } from "react-icons/lu";

export const AckButtonRange = ({
    tooltip,
    confirmTitle = "Квитировать все события?",
    confirmMessage,
    onAccept,
    isPending = false,
}) => {
    return (
        <Tooltip showArrow content={tooltip}>
            <IconButton
                variant="ghost"
                size="2xs"
                color={"fg"}
                loading={isPending}
                disabled={isPending}
                onClick={() =>
                    confirmDialog.open(CONFIRM_DIALOG_ID, {
                        onAccept,
                        title: confirmTitle,
                        message: confirmMessage,
                    })
                }
            >
                <LuCheckCheck />
            </IconButton>
        </Tooltip>
    );
};
