import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import { IconButton } from "@chakra-ui/react";
import { memo, useCallback } from "react";
import { LuCheck } from "react-icons/lu";

export const AckButtonCell = memo(
    ({ event, onAckEvent, isAckEventPending }) => {
        const handleClick = useCallback(() => {
            confirmDialog.open(CONFIRM_DIALOG_ID, {
                onAccept: () => onAckEvent(event),
                title: "Квитировать событие?",
            });
        }, [event, onAckEvent]);

        return (
            <button
                type="button"
                title="Квитировать событие"
                onClick={handleClick}
                disabled={isAckEventPending}
                style={{
                    cursor: "pointer",
                    border: "1px solid var(--chakra-colors-color-palette-border)",
                    borderRadius: "0.25rem",
                    width: "2rem",
                    height: "2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <LuCheck size={16} />
            </button>
        );
    },
);
AckButtonCell.displayName = "AckButtonCell";

export const AckButtonCellChakra = memo(
    ({ event, onAckEvent, isAckEventPending }) => {
        const handleClick = useCallback(() => {
            confirmDialog.open(CONFIRM_DIALOG_ID, {
                onAccept: () => onAckEvent(event),
                title: "Квитировать событие?",
            });
        }, [event, onAckEvent]);

        return (
            <IconButton
                size={"2xs"}
                variant={"outline"}
                onClick={handleClick}
                disabled={isAckEventPending}
                loading={isAckEventPending}
            >
                <LuCheck />
            </IconButton>
        );
    },
);
AckButtonCellChakra.displayName = "AckButtonCellChakra";
