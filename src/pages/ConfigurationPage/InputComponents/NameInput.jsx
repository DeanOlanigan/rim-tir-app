import { useVariablesStore } from "@/store/variables-store";
import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const NameInput = ({ id, value }) => {
    const [innerName, setInnerName] = useState(value);
    const renameNode = useVariablesStore((state) => state.renameNode);

    useEffect(() => {
        setInnerName(value);
    }, [value]);

    return (
        <Input
            size={"xs"}
            value={innerName}
            onChange={(e) => setInnerName(e.target.value)}
            onBlur={(e) => {
                if (e.target.value.trim() === value) return;
                setInnerName(e.target.value.trim());
                renameNode(id, e.target.value.trim());
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setInnerName(e.target.value.trim());
                    renameNode(id, e.target.value.trim());
                }
                if (e.key === "Escape") {
                    setInnerName(value);
                }
            }}
        />
    );
};
