import { memo, useState } from "react";
import { Input } from "@chakra-ui/react";
import { useVariablesStore } from "@/store/variables-store";

export const TextInput = memo(function TextInput(props) {
    //console.log("Render TextInput");
    const { id, targetKey, value } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    //const [initialValue, setInitialValue] = useState(value);
    return (
        <Input
            size={"xs"}
            maxW={"250px"}
            value={value}
            onChange={(e) => {
                setSettings(id, {
                    [targetKey]: e.target.value,
                });
                //setInitialValue(e.target.value);
            }}
            /* onBlur={() => {
                
            }} */
        />
    );
});
