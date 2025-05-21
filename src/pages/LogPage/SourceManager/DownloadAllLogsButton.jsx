import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { LuDownload } from "react-icons/lu";
import PropTypes from "prop-types";

function DownloadAllLogsButton({ type, loading }) {
    console.log("Render DownloadAllLogsButton");

    const fetchDownload = async () => {
        try {
            const response = await fetch(
                `/api/v1/getArchive?archive=logs&type=${type}`
            );
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.code === 202) {
                localStorage.setItem("logTaskId", result.data.task_id);
                return result.data.task_id;
            } else {
                throw new Error(result.message || "Неизвестная ошибка");
            }
        } catch (err) {
            throw new Error(`Ошибка: ${err.message}`);
        }
    };

    const checkStatus = async (taskId) => {
        try {
            const response = await fetch(
                `api/v1/getArchiveStatus?task_id=${taskId}`
            );
            if (!response.ok) {
                localStorage.removeItem("logTaskId");
                throw new Error(response.data.code);
            }
            const result = await response.json();
            if (response.ok && result.message == "Задача завершена") {
                localStorage.removeItem("logTaskId");
                let fileName = result.data.file;
                let taskId = result.data.task_id;
                window.location.href = `api/v1/getReadyArchive?file=${fileName}&task_id=${taskId}`;
                return `Файл ${fileName} готов`;
            }
            if (response.ok && result.message == "Задача выполняется") {
                console.log(result.data.status);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return checkStatus(taskId);
            }
        } catch (err) {
            localStorage.removeItem("logTaskId");
            throw new Error(`Ошибка: ${err.message}`);
        }
    };

    const downloadAllLogFiles = () => {
        //fetchDownload();
        toaster.promise(
            (async () => {
                const taskId = await fetchDownload();
                return await checkStatus(taskId);
            })(),
            {
                loading: {
                    title: "Идет формирование архива...",
                    description: "Пожалуйста, подождите.",
                },
                success: (result) => ({
                    title: "Готово",
                    description: result,
                }),
                error: (error) => ({
                    title: "Ошибка",
                    description: error,
                }),
            }
        );
    };

    return (
        <Button
            loading={loading}
            loadingText="Подождите..."
            variant="solid"
            style={{ width: "100%" }}
            onClick={downloadAllLogFiles}
        >
            <LuDownload /> Скачать все логи из списка
        </Button>
    );
}
DownloadAllLogsButton.propTypes = {
    type: PropTypes.string,
    loading: PropTypes.bool,
};

export default DownloadAllLogsButton;
