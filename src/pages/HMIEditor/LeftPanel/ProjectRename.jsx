import { useState } from "react";
import { useNodeStore } from "../store/node-store";
import { Editable } from "@chakra-ui/react";

export const ProjectRename = () => {
    const projectName = useNodeStore((state) => state.projectName);

    const [name, setName] = useState(projectName);

    return (
        <Editable.Root
            size={"sm"}
            value={name}
            onValueChange={(e) => setName(e.value)}
            onValueCommit={(e) => {
                const next = e.value.trim();
                if (next) useNodeStore.getState().renameProject(next);
            }}
            submitMode="both"
            activationMode="click"
            selectOnFocus
            required
            maxLength={80}
        >
            <Editable.Preview truncate fontSize={"md"} fontWeight={"medium"} />
            <Editable.Input fontSize={"md"} fontWeight={"medium"} />
        </Editable.Root>
    );
};
