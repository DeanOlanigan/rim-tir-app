import { memo, useEffect, useState } from "react";
import { Input, InputGroup } from "@chakra-ui/react";
import { useVariablesStore } from "@/store/variables-store";
import { ErrorSign } from "./ErrorSign";

export const TextInput = memo(function TextInput(props) {
    const { id, targetkey, value, errors, ...rest } = props;
    const [innerValue, setInnerValue] = useState(value);
    const { setSettings } = useVariablesStore.getState();

    useEffect(() => {
        setInnerValue(value);
    }, [value]);

    return (
        <InputGroup
            endElement={
                errors && errors.size !== 0 && <ErrorSign errors={errors} />
            }
        >
            <Input
                size={"xs"}
                maxW={"250px"}
                autoComplete="off"
                value={innerValue}
                onChange={(e) => setInnerValue(e.target.value)}
                onBlur={(e) => {
                    if (e.target.value === value) return;
                    setInnerValue(e.target.value);
                    setSettings(id, {
                        [targetkey]: e.target.value,
                    });
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setInnerValue(e.target.value);
                        setSettings(id, {
                            [targetkey]: e.target.value,
                        });
                    }
                    if (e.key === "Escape") {
                        setInnerValue(value);
                    }
                }}
                {...rest}
            />
        </InputGroup>
    );
});
