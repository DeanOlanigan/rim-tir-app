import { Button, DownloadTrigger } from "@chakra-ui/react";
import { LuDownload } from "react-icons/lu";
import { useLogStore } from "../store/store";
import { downloadLogs } from "@/api/routes/logs.api";

export const DownloadAllLogsButton = () => {
    const fetchLogs = async () => {
        const logsToDwnl = useLogStore.getState().logsToDwnl;
        console.log(logsToDwnl);
        const res = await downloadLogs({ names: logsToDwnl });
        console.log(res);
        return res;
    };

    return (
        <DownloadTrigger
            data={fetchLogs}
            fileName={`logs_${new Date().toISOString()}.zip`}
            type="application/zip"
            asChild
        >
            <Button w={"full"}>
                <LuDownload /> Скачать выбранные логи
            </Button>
        </DownloadTrigger>
    );
};
