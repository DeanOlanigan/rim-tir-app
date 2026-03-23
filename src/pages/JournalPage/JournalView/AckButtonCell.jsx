import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import { IconButton } from "@chakra-ui/react";
import { memo, useCallback } from "react";
import { LuCheck } from "react-icons/lu";
import { useAckEventStreamMutation } from "../hooks/useAckEventMutation";

export const AckButtonCell = memo(({ event }) => {
    const handleClick = () => {
        console.log("ACK", event.id);
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

export const AckButtonCellChakra = memo(({ event }) => {
    // TODO Вынести квитирования в функцию компонента верхнего уровня
    const ackMutation = useAckEventStreamMutation();

    const isPending = ackMutation.isPending;

    const handleClick = useCallback(() => {
        confirmDialog.open(CONFIRM_DIALOG_ID, {
            onAccept: () => {
                ackMutation.mutate({
                    eventId: event.id,
                    event: event.event,
                    message: `Квитирование события ${event.event}`,
                });
            },
            title: "Квитировать событие?",
        });
    }, [ackMutation, event.id, event.event]);

    return (
        <IconButton
            size={"2xs"}
            variant={"outline"}
            onClick={handleClick}
            disabled={isPending}
            loading={isPending}
        >
            <LuCheck />
        </IconButton>
    );
});
AckButtonCellChakra.displayName = "AckButtonCellChakra";
