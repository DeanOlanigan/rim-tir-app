import { useHasChosenLog } from "./Store/store";
import LogSourceManager from "./SourceManager/LogSourceManager";
import LogViewer from "./Viewer/LogViewer";

function LogPage() {
    const hasChosenLog = useHasChosenLog();

    return hasChosenLog ? <LogViewer /> : <LogSourceManager />;
}

export default LogPage;
