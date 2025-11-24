import { create } from "zustand";

export const useSettingStore = create(
    (set) => ({
        Journals: [
            {
                name: "event",
                size: "0.5 MB",
                files: "1",
                archive: false,
            },
            {
                name: "TI",
                size: "0.5 MB",
                files: "1",
                archive: false,
            }
        ],
        WebServer: {
            port: "5173",
            time: "08:00",
            https: false,
            sslSert: "",
        },
        Logs: {
            size: "0.5",
            files: "1",
            archive: false,
        },

        setJournalSetting: (jourName, field,updated) => set((state) => ({    
            Journals: state.Journals.map((journal) => 
                journal.name === jourName
                    ? {...journal, [field]: updated}
                    : journal
            )
        })),
        
        setSettings: (settingname, field, data) => set((state) => ({
            [settingname]: {...state[settingname], [field]: data}
        })),
    })
);