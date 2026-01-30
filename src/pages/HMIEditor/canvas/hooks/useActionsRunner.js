import { toaster } from "@/components/ui/toaster";
import { useCallback } from "react";
import { useMqttCore } from "@/utils/mqtt/mqtt-provider";
import { useNodeStore } from "../../store/node-store";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";

async function confirmationFunc(options) {
    const isConfirmed = await confirmDialog.open(CONFIRM_DIALOG_ID, {
        title: options.title || "Confirmation",
        message: options.message || "Are you sure?",
        confirmationText: options.confirmationText || "OK",
        cancelText: options.cancelText || "Cancel",
    });

    if (!isConfirmed) {
        throw new Error("CANCELED_BY_USER");
    }
}

function navigateFunc(options) {
    const mode = options.mode || "PAGE";
    const target = options.target;
    if (!target) {
        console.warn("Navigation targer is missing");
        return;
    }
    if (mode === "PAGE") {
        console.log(`[NAVIGATE] Internal switch to page ID: ${target}`);
        const storeState = useNodeStore.getState();
        if (storeState.pages[target]) {
            useNodeStore.getState().setActivePage(target);
        } else {
            throw new Error(`Target page not found: ${target}`);
        }
    } else if (mode === "URL") {
        console.log(`[NAVIGATE] External link: ${target}`);
        window.open(
            target || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "_blank",
        );
    }
}

export const useActionsRunner = () => {
    const { publish, connected } = useMqttCore();
    const executeSingleAction = async (action) => {
        const { type, options } = action;

        function sendCommand(varId, value) {
            console.log(`[MQTT] Write ${varId} = ${value}`);
            const data = JSON.stringify({ v: value });
            if (connected) {
                publish(`commands/node/${varId}`, data);
            }
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
                await confirmationFunc(options);
                break;
            }
            case "NAVIGATE": {
                navigateFunc(options);
                break;
            }
            default:
                break;
        }
    };

    const runActions = useCallback(async (actions) => {
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
        // TODO Убедиться в стабильности ссылки на функцию
    }, []);

    return runActions;
};
