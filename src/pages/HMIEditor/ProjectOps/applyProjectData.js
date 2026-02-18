import { toaster } from "@/components/ui/toaster";
import { useNodeStore } from "../store/node-store";
import { normalizeProjectTree } from "./normalizeProjectTree";
import { validateProjectStructure } from "./projectSchema";

export const applyProjectData = (rawProjectData, mode, filename) => {
    const validation = validateProjectStructure(rawProjectData);
    if (!validation.ok) throw new Error(validation.errors.join(", "));

    const normalized = normalizeProjectTree(validation.value, {
        pruneOrphans: true,
        onIssue: (i) => {
            toaster.create({
                type: "error",
                title: "Произошла ошибка",
                description: i.message,
            });
        },
    });

    const store = useNodeStore.getState();
    store.open(normalized, mode, filename);
};
