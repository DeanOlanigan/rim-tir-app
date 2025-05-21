import { Editable } from "@chakra-ui/react";
import { useState } from "react";
import { useVariablesStore } from "@/store/variables-store";

export const DescriptionCell = ({ id, description }) => {
    const [value, setValue] = useState(description);
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <Editable.Root
            size={"sm"}
            value={value}
            onValueChange={(e) => setValue(e.value)}
            onValueCommit={(e) => setSettings(id, { description: e.value })}
            onValueRevert={() => setValue(description)}
            placeholder={"Введите описание"}
        >
            <Editable.Preview />
            <Editable.Textarea />
        </Editable.Root>
    );
};
