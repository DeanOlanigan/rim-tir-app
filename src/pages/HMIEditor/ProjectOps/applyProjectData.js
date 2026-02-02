import { toaster } from "@/components/ui/toaster";
import { useNodeStore } from "../store/node-store";
import { validateProjectStructure } from "./projectSchema";

export const applyProjectData = (
    rawProjectData,
    successMessage,
    mode,
    filename,
) => {
    try {
        const validation = validateProjectStructure(rawProjectData);
        if (!validation.ok) {
            throw new Error(validation.errors.join(", "));
        }
        const validProject = validation.value;

        const store = useNodeStore.getState();
        store.open(validProject, mode, filename);
        store.rebuildVarIndex();

        toaster.create({
            type: "success",
            title: successMessage || "Проект загружен",
        });
    } catch (err) {
        console.error("Error applying project data:", err);
        toaster.create({
            type: "error",
            title: "Произошла ошибка",
            description: err?.message ?? "Неизвестная ошибка",
        });
    }
};
