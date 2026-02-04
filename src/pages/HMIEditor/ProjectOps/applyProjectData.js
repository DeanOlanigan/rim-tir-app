import { useNodeStore } from "../store/node-store";
import { validateProjectStructure } from "./projectSchema";

export const applyProjectData = (rawProjectData, mode, filename) => {
    const validation = validateProjectStructure(rawProjectData);
    if (!validation.ok) {
        throw new Error(validation.errors.join(", "));
    }
    const validProject = validation.value;

    const store = useNodeStore.getState();
    store.open(validProject, mode, filename);
    store.rebuildVarIndex();
};
