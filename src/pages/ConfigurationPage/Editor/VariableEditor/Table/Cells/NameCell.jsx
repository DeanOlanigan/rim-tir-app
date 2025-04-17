import { Editable } from "@chakra-ui/react";
import { useState } from "react";
import { useVariablesStore } from "../../../../../../store/variables-store";

export const NameCell = ({ id, name }) => {
    const [value, setValue] = useState(name);
    const renameNode = useVariablesStore((state) => state.renameNode);

    return (
        <Editable.Root
            size={"sm"}
            value={value}
            onValueChange={(e) => setValue(e.value)}
            onValueCommit={(e) => renameNode("variables", id, e.value)}
            onValueRevert={() => setValue(name)}
        >
            <Editable.Preview />
            <Editable.Input />
        </Editable.Root>
    );
};
