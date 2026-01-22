import { toaster } from "@/components/ui/toaster";
import { CONFIRMATION_DIALOG_ID, confirmationDialog } from "../../dialog";

export const useActionsRunner = () => {
    const executeSingleAction = async (action) => {
        const { type, options } = action;

        function sendCommand(varId, value) {
            console.log(`[MQTT] Write ${varId} = ${value}`);
        }

        switch (type) {
            case "WRITE_TAG": {
                if (!options.varId) throw new Error("Tag ID is required");
                if (!options.value) throw new Error("Value is required");
                sendCommand(options.varId, options.value);
                break;
            }
            case "TOGGLE_TAG": {
                const currentVal = 0;
                const newVal = currentVal === 0 ? 1 : 0;
                sendCommand(options.varId, newVal);
                break;
            }
            case "CONFIRMATION": {
                const isConfirmed = await confirmationDialog.open(
                    CONFIRMATION_DIALOG_ID,
                    {
                        title: options.title || "Confirmation",
                        message: options.message || "Are you sure?",
                        confirmationText: options.confirmationText || "OK",
                        cancelText: options.cancelText || "Cancel",
                    },
                );

                if (!isConfirmed) {
                    throw new Error("CANCELED_BY_USER");
                }
                break;
            }
            case "NAVIGATE": {
                // const navigate = useNavigate(); // Если внутри Router
                console.log(`Navigating to ${options.target}`);

                window.open(
                    options.target ||
                        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "_blank",
                );

                // if (options.mode === 'new_tab') window.open(...)
                // else navigate(options.target);
                break;
            }
            default:
                break;
        }
    };

    const runActions = async (actions) => {
        if (!actions || !Array.isArray(actions) || actions.length === 0) return;

        let errorMsg = null;
        for (const action of actions) {
            try {
                await executeSingleAction(action);
            } catch (error) {
                if (error.message === "CANCELED_BY_USER") {
                    console.log("ACTION CHAIN STOPPED BY USER");
                    errorMsg = "Цепочка действий прервана пользователем";
                } else {
                    console.error("ACTION CHAIN ERROR", error);
                    errorMsg = error.message;
                }
                break;
            }
        }

        if (errorMsg) {
            toaster.create({
                title: "Произошла ошибка",
                description: errorMsg,
                type: "error",
            });
        } else {
            toaster.create({
                title: "Действия выполнены",
                type: "success",
            });
        }
    };

    return {
        runActions,
    };
};
