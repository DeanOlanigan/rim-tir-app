import { useCallback, useState, useEffect } from "react";
import { useVariablesStore } from "../../../store/variables-store";
import debounce from "debounce";
import { Textarea } from "@chakra-ui/react";
import { Field } from "../../../components/ui/field";
import { memo } from "react";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";

export const DebouncedTextarea = memo(function DebouncedTextarea(props) {
    const { targetKey, value, id, showLabel = false } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    const [innerValue, setInnerValue] = useState(value);
    const label = PARAM_DEFINITIONS[targetKey].label;

    useEffect(() => {
        setInnerValue(value);
    }, [value]);

    const debounced = useCallback(
        debounce((data) => {
            setSettings(data.id, {
                [targetKey]: data.value,
            });
        }, 500),
        []
    );

    return (
        <Field label={showLabel ? label : ""}>
            <Textarea
                size={"xs"}
                minH={"32px"}
                maxH={"128px"}
                maxW={"510px"}
                rows={"1"}
                value={innerValue}
                onChange={(e) => {
                    setInnerValue(e.target.value);
                    debounced({ id, value: e.target.value });
                }}
            />
        </Field>
    );
});
