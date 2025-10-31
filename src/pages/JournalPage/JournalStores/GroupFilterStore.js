import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGroupStore = create(
    persist(
        (set) => ({
            selectedGroups: [
                "Состояние",
                "Аварийная",
                "Предупредительная",
                "Без Группы",
                "Пауза",
                "Возобновлен",
            ],
            setSelectedGroups: (newGroups) =>
                set({ selectedGroups: newGroups }),
        }),
        {
            name: "group-store",
        }
    )
);
