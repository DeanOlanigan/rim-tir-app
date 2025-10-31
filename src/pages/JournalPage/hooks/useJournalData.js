import { useJournalHistory } from "./useJournalHistory";
import { useMqttJournal } from "./useMqttJournal";

export const useJournalData = () => {
    const q = useJournalHistory();
    useMqttJournal();
    return q ;
};