import { memo } from "react";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";
import { useVariablesStore } from "../../../store/variables-store";
import { useVariableDrop } from "../../../hooks/useVariableDrop";
import { Badge } from "@chakra-ui/react";
import { useVariablesCollection } from "../../../hooks/useVariablesCollection";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

export const DroppableInput = memo(function DroppableInput(props) {
    const { targetKey, id, showLabel = false } = props;
    const label = PARAM_DEFINITIONS[targetKey].label;

    console.log("Render DroppableInput");
    const { isOver, canDrop, dropRef } = useVariableDrop({ id });

    const variables = useVariablesCollection();
    const { bindVariable, unbindVariable } = useVariablesStore(
        (state) => state
    );
    const variable = useVariablesStore(
        (state) => state.settings[state.settings[id].variableId]?.name
    );

    let borderColor = variable ? "fg.subtle" : "fg.info";
    let backgroundColor = variable ? "bg.muted" : "bg.info";
    if (isOver && canDrop) {
        borderColor = "fg.success";
        backgroundColor = "bg.success";
    } else if (isOver && !canDrop) {
        borderColor = "fg.error";
        backgroundColor = "bg.error";
    }

    return (
        <AutoComplete
            matchWidth
            prefocusFirstItem={false}
            value={variable}
            onSelectOption={(selected) => {
                console.log(selected);
                unbindVariable(id);
                if (!selected.item.value) return;
                bindVariable(id, selected.item.value);
            }}
        >
            {({ isOpen, onOpen, onClose }) => (
                <>
                    <AutoCompleteInput
                        ref={dropRef}
                        placeholder={
                            isOpen
                                ? "Или перетащите переменную"
                                : "Введите название переменной"
                        }
                        h={"32px"}
                        border={"2px dashed"}
                        borderColor={borderColor}
                        borderRadius={"md"}
                        backgroundColor={backgroundColor}
                        variant={"subtle"}
                        size={"xs"}
                        onClick={onOpen}
                        onBlur={(e) => {
                            console.log("onBlur");
                            if (!e.target.value) {
                                console.log("empty");
                                unbindVariable(id);
                            }
                            onClose();
                        }}
                    />
                    {isOpen && (
                        <AutoCompleteList p={"0"} bg={"bg.default"}>
                            {variables?.items.map((row) => (
                                <AutoCompleteItem
                                    m={"1"}
                                    key={row.id}
                                    value={row}
                                    getValue={(item) => item.id}
                                    label="value"
                                    gap={"4"}
                                    align={"center"}
                                    h={"24px"}
                                    borderRadius={"sm"}
                                    disabled={row.disabled}
                                >
                                    {row.label}
                                    {row.disabled && (
                                        <Badge colorPalette={"red"}>
                                            Используется
                                        </Badge>
                                    )}
                                </AutoCompleteItem>
                            ))}
                        </AutoCompleteList>
                    )}
                </>
            )}
        </AutoComplete>
    );
});
