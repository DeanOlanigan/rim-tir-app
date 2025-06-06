import { SCOPE } from "@/config/paramDefinitions";
import { useVariablesStore } from "@/store/variables-store";
import { validateName } from "@/utils/validator";
import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const NameInput = ({ id, value}) => {
    const [innerName, setInnerName] = useState(value);
    const renameNodeSetting = useVariablesStore(
        (state) => state.renameNodeSetting
    );

    useEffect(() => {
        setInnerName(value);
    }, [value]);

    return (
        <Input
            size={"xs"}
            value={innerName}
            onChange={(e) => setInnerName(e.target.value)}
            onBlur={(e) => {
                setInnerName(e.target.value.trim());
                renameNodeSetting(id, e.target.value.trim());
                validateName({ id: id, scope: SCOPE.IGNOREFOLDER });
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setInnerName(e.target.value.trim());
                    renameNodeSetting(id, e.target.value.trim());
                    validateName({ id: id, scope: SCOPE.IGNOREFOLDER });
                }
                if (e.key === "Escape") {
                    setInnerName(value);
                }
            }}
        />
    );
};
