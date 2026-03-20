import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import { IconButton } from "@chakra-ui/react";
import { memo } from "react";
import { LuCheck } from "react-icons/lu";
import { useJournalStream } from "../JournalStores/journal-stream-store";
import { eventAcknowledge } from "@/api/commands";

export const AckButtonCell = memo(({ id }) => {
    const handleClick = () => {
        console.log("ACK", id);
    };

    return (
        <button
            type="button"
            title="Квитировать событие"
            onClick={handleClick}
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
});
AckButtonCell.displayName = "AckButtonCell";

export const AckButtonCellChakra = memo(({ id }) => {
    const handleClick = () =>
        confirmDialog.open(CONFIRM_DIALOG_ID, {
            onAccept: () => {
                const event = useJournalStream.getState().entities[id].event;
                eventAcknowledge({
                    eventId: id,
                    event,
                    message: `Квитирование события ${event}`,
                });
            },
            title: "Квитировать событие?",
        });

    return (
        <IconButton size={"2xs"} variant={"outline"} onClick={handleClick}>
            <LuCheck />
        </IconButton>
    );
});
AckButtonCellChakra.displayName = "AckButtonCellChakra";
