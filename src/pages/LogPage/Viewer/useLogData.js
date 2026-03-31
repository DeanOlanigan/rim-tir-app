import { useLogStore } from "../store/store";
import { useFilteredLogs } from "../store/stream-store";
import { useLogHistory } from "./useLogHistory";
import { useMqttLogs } from "./useMqttLogs";

export function useLogData() {
    const { chosenLog, logRowsCount, logTextSize, isLogTextWrapped, filter } =
        useLogStore();
    const q = useLogHistory(chosenLog?.label, logRowsCount);
    useMqttLogs(chosenLog?.label, {
        enabled: q.isSuccess,
    });

    const filterSet = new Set(filter);
    const live = useFilteredLogs(filterSet);

    return { q, live, logTextSize, isLogTextWrapped };
}
