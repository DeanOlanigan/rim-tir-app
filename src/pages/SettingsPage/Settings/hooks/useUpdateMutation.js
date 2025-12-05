import { apiv2 } from "@/api/baseUrl";
import { useMutation } from "@tanstack/react-query";


export const useUpdateMutation = (setDown, setLogs, isDown, fileUpload) => {
    return useMutation({
        mutationKey: ["senderFile"],
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("downloader", fileUpload.acceptedFiles[0]);
            return apiv2
                .post("/getUpdate", formData)
                .then((res) => console.log(res))
                .catch((err) => {
                    throw err;
                });
        },
        onSuccess: () => {
            setDown(!isDown);
            setLogs([]);
        },
        onError: (err) => {
            const status =
                err?.response?.status || err?.message || "NO CONNECTION";
            const code =
                err?.response?.data?.error?.code ||
                err?.response?.data?.error ||
                err?.code ||
                "NO CONNECTION";
            setLogs([
                "Ошибка при установке обновления: " + `${status} ${code}`,
            ]);
            setDown(false);
        },
    });  
};