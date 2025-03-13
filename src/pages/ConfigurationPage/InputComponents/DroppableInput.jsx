import { memo } from "react";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";
import { useVariablesStore } from "../../../store/variables-store";
import { useVariableDrop } from "../../../hooks/useVariableDrop";
import {
    SelectRoot,
    SelectTrigger,
    SelectValueText,
    SelectContent,
    SelectItem,
    SelectLabel,
} from "../../../components/ui/select";
import { Badge, Flex } from "@chakra-ui/react";
import { useVariablesCollection } from "../../../hooks/useVariablesCollection";

export const DroppableInput = memo(function DroppableInput(props) {
    const { targetKey, id, showLabel = false } = props;
    const label = PARAM_DEFINITIONS[targetKey].label;

    console.log("Render DroppableInput");
    //const setSettings = useVariablesStore((state) => state.setSettings);
    const { isOver, canDrop, dropRef } = useVariableDrop({ id });

    const variables = useVariablesCollection();
    const { bindVariable, unbindVariable } = useVariablesStore(
        (state) => state
    );
    const variable = useVariablesStore(
        (state) => state.settings[state.settings[id].variableId]?.name
    );

    let borderColor = variable ? "fg.subtle" : "fg.info";
    let backgroundColor = variable ? "bg.emphasized" : "bg.info";
    if (isOver && canDrop) {
        borderColor = "fg.success";
        backgroundColor = "bg.success";
    } else if (isOver && !canDrop) {
        borderColor = "fg.error";
        backgroundColor = "bg.error";
    }

    return (
        <SelectRoot
            maxW={"250px"}
            ref={dropRef}
            size={"xs"}
            collection={variables}
            value={[variable]}
            onValueChange={(details) => {
                unbindVariable(id);
                if (details.items.length === 0) return;
                bindVariable(id, details.items[0].id);
            }}
        >
            {showLabel && <SelectLabel>{label}</SelectLabel>}
            <SelectTrigger
                border={"2px dashed"}
                borderColor={borderColor}
                borderRadius={"md"}
                backgroundColor={backgroundColor}
                clearable
            >
                <SelectValueText
                    placeholder={`Выберите ${label.toLowerCase()}`}
                />
            </SelectTrigger>
            {/* <SelectContent>
                {variables?.items.map((row) => (
                    <SelectItem item={row} key={row.value}>
                        <Flex gap={"4"} align={"center"}>
                            {row.label}
                            {row.disabled && (
                                <Badge colorPalette={"red"}>Используется</Badge>
                            )}
                        </Flex>
                    </SelectItem>
                ))}
            </SelectContent> */}
        </SelectRoot>
    );
});
