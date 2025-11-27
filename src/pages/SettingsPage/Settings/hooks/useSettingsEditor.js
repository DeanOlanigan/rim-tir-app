import { useQueryClient } from "@tanstack/react-query";

export const useSettingsEditor = (isJournal = false) => {
    const client = useQueryClient();

    if (isJournal) {
        const EditSettings = (data, field, name, journalName) =>
            client.setQueryData(["settings"], (oldSetting) => ({
                ...oldSetting,
                [name]: 
                    oldSetting[name]?.map((journal) => 
                        journal.name === journalName
                            ? {...journal, [field] : data}
                            : journal
                    ),
                
            }));
        
        
        return EditSettings;
    }

    const EditSettings = (data, field, name) =>
        client.setQueryData(["settings"], (oldSetting) => ({
            ...oldSetting,
            [name]: {
                ...oldSetting?.[name],
                [field]: data,
            },
        }));

    
    return EditSettings;
};