import { Button } from "../../components/ui/button";
import { LuDownload } from "react-icons/lu";
import PropTypes from "prop-types";

function DownloadAllLogsButton({ headingText, loading }) {

    let type = "";
    switch (headingText) {
    case "Логи на SD карте роутера":
        type = "sd";
        break;
    case "Логи во внутренней памяти роутера":
    default:
        type = "r";
        break;
    }

    const fetchDownload = async () => {
        try {
            const response = await fetch(`/api/v1/getArchive?archive=logs&type=${type}`);
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.code === 202) {
                localStorage.setItem("logTaskId", result.data.task_id);
                checkStatus(result.data.task_id);
                alert(`TASK STARTED ${result.message}`);
            } else {
                throw new Error(result.message || "Неизвестная ошибка");
            }
        } catch (err) {
            throw new Error(`Ошибка: ${err.message}`);
        }
    };

    const checkStatus = async (taskId) => {
        try {
            const response = await fetch(`api/v1/getArchiveStatus?task_id=${taskId}`);
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
                alert(`Файл ${fileName}, Задача ${taskId}`);
            }
            if (response.ok && result.message == "Задача выполняется") {
                console.log(result.data.status);
                setTimeout(() =>checkStatus(taskId), 1000);
            }
        } catch (err) {
            alert(err);
        }
    };

    const downloadAllLogFiles = () => {
        fetchDownload();
    };

    return (
        <Button 
            loading={loading}
            loadingText="Подождите..."
            variant="solid"
            style={{width: "100%"}}
            onClick={downloadAllLogFiles}>
            <LuDownload /> Скачать все логи из списка
        </Button>
    );
}
DownloadAllLogsButton.propTypes = {
    headingText: PropTypes.string,
    loading: PropTypes.bool,
};

export default DownloadAllLogsButton;
