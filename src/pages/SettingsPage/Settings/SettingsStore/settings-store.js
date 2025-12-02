import { create } from "zustand";

export const useSettingStore = create(
    (set) => ({

        settings : {
            Journals: [
                { name: "event", size: "0.5 MB", files: "1", archive: false },
                { name: "TI", size: "0.5 MB", files: "1", archive: false },
            ],
            WebServer: { port: "41105", time: "14:00", https: false, sslSert: "" },
            Logs: { size: "0.5", files: "1", archive: false },
        },

        setSettings: (newSettings) => set(() => ({settings: newSettings})),

        editSettings: (data, field, name) => set((state) => ({
            settings: {
                ...state.settings,
                [name]: {
                    ...state.settings[name],
                    [field]: data
                }
            }
        })),

        editSettingsJourn: (data, field, name) => set((state) => ({
            settings: {
                ...state.settings,
                Journals: 
                    state.settings.Journals.map((journal) => 
                        journal.name === name
                            ? {...journal, [field] : data}
                            : journal
                    )
                
            }
        })),

    })
);