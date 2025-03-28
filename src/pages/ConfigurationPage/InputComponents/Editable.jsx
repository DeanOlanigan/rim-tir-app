import { Editable } from "@chakra-ui/react";
import { useState } from "react";
import { useVariablesStore } from "../../../store/variables-store";

export const EditableInput = ({ id, value, targetKey }) => {
    const [innerValue, setValue] = useState(value);
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <Editable.Root
            size={"sm"}
            value={innerValue}
            onValueChange={(e) => setValue(e.value)}
            onValueCommit={(e) => setSettings(id, { [targetKey]: e.value })}
            onValueRevert={() => setValue(value)}
            placeholder={"Введите описание"}
        >
            <Editable.Preview />
            <Editable.Textarea />
        </Editable.Root>
    );
};
