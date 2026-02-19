import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";

export const handleActionWithGuard = (isDirty, actionCallback, opts = {}) => {
    const {
        title = "Вы уверены?",
        message = "Есть несохраненные изменения. Продолжить?",
    } = opts;

    if (isDirty) {
        confirmDialog.open(CONFIRM_DIALOG_ID, {
            onAccept: () => {
                actionCallback();
            },
            title,
            message,
        });
    } else {
        actionCallback();
    }
};

export const splitKeyLabel = (label) => {
    if (!label) return [];
    if (label.includes("+")) {
        return label
            .split("+")
            .map((part) => part.trim())
            .filter(Boolean);
    }
    return label
        .split(" ")
        .map((part) => part.trim())
        .filter(Boolean);
};
