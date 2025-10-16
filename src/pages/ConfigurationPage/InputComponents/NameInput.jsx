import { useVariablesStore } from "@/store/variables-store";
import { Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ErrorSign } from "./ErrorSign";

export const NameInput = (props) => {
    const { id, value, errors, ...rest } = props;
    const [innerName, setInnerName] = useState(value);
    const renameNode = useVariablesStore((state) => state.renameNode);

    useEffect(() => {
        setInnerName(value);
    }, [value]);

    return (
        <InputGroup
            endElement={
                errors && errors.size !== 0 && <ErrorSign errors={errors} />
            }
        >
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
                {...rest}
            />
        </InputGroup>
    );
};
