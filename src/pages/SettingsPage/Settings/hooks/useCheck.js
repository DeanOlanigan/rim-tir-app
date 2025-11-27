import { useCallback } from "react"
import { useSettingStore } from "../SettingsStore/settings-store"


export const useCheck = () => {

    const setChanged = useSettingStore(s => s.setChanged);

    const CheckChange = useCallback((newChanged) =>
        setChanged(newChanged), []
    );

    return CheckChange;
};