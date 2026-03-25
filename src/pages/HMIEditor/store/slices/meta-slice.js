import { nanoid } from "nanoid";

// mode: "new" | "local" | "server"
export const createMetaSlice = () => ({
    meta: {
        mode: "new",
        projectId: nanoid(12),
        filename: "untitled",
        isDirty: false,
        treeRev: 0,
    },
});
