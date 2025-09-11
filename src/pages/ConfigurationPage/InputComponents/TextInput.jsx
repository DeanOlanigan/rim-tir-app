import { memo, useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { useVariablesStore } from "@/store/variables-store";

export const TextInput = memo(function TextInput(props) {
    //console.log("Render TextInput");
    const { id, targetKey, value } = props;
    const [innerValue, setInnerValue] = useState(value);
    const setSettings = useVariablesStore((state) => state.setSettings);

    useEffect(() => {
        setInnerValue(value);
    }, [value]);

    return (
        <Input
            size={"xs"}
            maxW={"250px"}
            value={innerValue}
            onChange={(e) => setInnerValue(e.target.value)}
            onBlur={(e) => {
                if (e.target.value === value) return;
                setInnerValue(e.target.value);
                setSettings(id, {
                    [targetKey]: e.target.value,
                });
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setInnerValue(e.target.value);
                    setSettings(id, {
                        [targetKey]: e.target.value,
                    });
                }
                if (e.key === "Escape") {
                    setInnerValue(value);
                }
            }}
        />
    );
});
