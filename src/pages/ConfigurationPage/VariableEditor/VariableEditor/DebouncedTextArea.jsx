import { useCallback, useState, useEffect } from "react";
import { useVariablesStore } from "../../../../store/variables-store";
import debounce from "debounce";
import { Field, Textarea } from "@chakra-ui/react";
import { headerMapping } from "../../../MonitoringPage/mappings";

export const DebouncedTextarea = ({ description, id }) => {
    const setSettings = useVariablesStore((state) => state.setSettings);
    const [value, setValue] = useState(description);

    useEffect(() => {
        setValue(description);
    }, [description]);

    const debounced = useCallback(
        debounce((data) => {
            setSettings(data.id, {
                description: data.description,
            });
        }, 500),
        []
    );

    return (
        <Field.Root>
            <Field.Label>{headerMapping["description"]}</Field.Label>
            <Textarea
                size={"xs"}
                resize={"none"}
                rows={"5"}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    debounced({ id, description: e.target.value });
                }}
            />
        </Field.Root>
    );
};
