import { useCallback, useState, useEffect } from "react";
import { useVariablesStore } from "../../../../store/variables-store";
import debounce from "debounce";
import { Textarea } from "@chakra-ui/react";
import { Field } from "../../../../components/ui/field";
import { headerMapping } from "../../../MonitoringPage/mappings";

export const DebouncedTextarea = ({ description, id, showLabel = false }) => {
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
        <Field label={showLabel ? headerMapping["description"] : ""}>
            <Textarea
                size={"xs"}
                minH={"32px"}
                maxH={"128px"}
                rows={"1"}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    debounced({ id, description: e.target.value });
                }}
            />
        </Field>
    );
};
