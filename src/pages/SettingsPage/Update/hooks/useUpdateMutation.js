import { initiateUpdate } from "@/api/routes/update.api";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateMutation = (setDown, setLogs, isDown) => {
    return useMutation({
        mutationKey: ["senderFile"],
        mutationFn: initiateUpdate,
        onSuccess: () => {
            setDown(!isDown);
            setLogs([]);
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                const status = err?.response?.status || err?.message;
                const code =
                    err?.response?.data?.error?.code ||
                    err?.response?.data?.error ||
                    err?.code;
                setLogs([
                    "Ошибка при установке обновления: " + `${status} ${code}`,
                ]);
                setDown(false);
            } else {
                setLogs(["Неизвестная ошибка при установке обновления"]);
                setDown(false);
            }
        },
    });
};
