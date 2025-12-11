import { apiv2 } from "@/api/baseUrl";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateMutation = (setDown, setLogs, isDown, fileUpload) => {
    return useMutation({
        mutationKey: ["senderFile"],
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("downloader", fileUpload.acceptedFiles[0]);
            const res = await apiv2.post("/getUpdate", formData);
            return res;
        },
        onSuccess: () => {
            setDown(!isDown);
            setLogs([]);
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                const status =
                    err?.response?.status || err?.message;
                const code =
                    err?.response?.data?.error?.code ||
                    err?.response?.data?.error ||
                    err?.code;
                setLogs([
                    "Ошибка при установке обновления: " + `${status} ${code}`,
                ]);
                setDown(false);
            } else {
                setLogs([
                    "Неизвестная ошибка при установке обновления",
                ]);
                setDown(false);
            }
        },
    });  
};
