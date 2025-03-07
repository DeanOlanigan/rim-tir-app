import { memo } from "react";
import { Field } from "../../../components/ui/field";
import { Input, Flex } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";
import { useVariablesStore } from "../../../store/variables-store";
import { DropComponent } from "../Editor/ConnectionEditor/DropComponent";

export const DroppableInput = memo(function DroppableInput(props) {
    const { targetKey, id, value, showLabel = false } = props;
    const label = PARAM_DEFINITIONS[targetKey].label;

    console.log("Render DroppableInput");
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <Field label={showLabel ? label : ""}>
            <Flex gap={"2"} h={"100%"} w={"100%"}>
                <Input
                    size={"xs"}
                    value={value}
                    onChange={(e) => {
                        setSettings(id, {
                            [targetKey]: e.target.value,
                        });
                    }}
                />
                <DropComponent id={id} showText={false} />
            </Flex>
        </Field>
    );
});
