import { QK } from "@/api";
import { useQueryClient } from "@tanstack/react-query";

export function useSettingsFromCache() {
    const qc = useQueryClient();
    const conf = qc.getQueryData(QK.configuration);
    return conf?.settings ?? {};
}
