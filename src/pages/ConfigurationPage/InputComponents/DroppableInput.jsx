import { memo } from "react";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";
import { useVariablesStore } from "../../../store/variables-store";
//import { useVariableDrop } from "../../../hooks/useVariableDrop";
import { Badge, Text } from "@chakra-ui/react";
import { useVariablesCollection } from "../../../hooks/useVariablesCollection";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { Field } from "../../../components/ui/field";

const autocomleteFilter = (query, optionValue, optionLabel) => {
    const lowerCaseQuery = query.toLowerCase();
    //const lowerCaseOptionValue = optionValue.toLowerCase();
    const lowerCaseOptionLabel = optionLabel.toLowerCase();
    return lowerCaseOptionLabel.indexOf(lowerCaseQuery) !== -1;
};

export const DroppableInput = memo(function DroppableInput(props) {
    const {
        targetKey,
        id,
        showLabel = false,
        submit = () => {},
        reset = () => {},
        forNode = false,
    } = props;
    const label = PARAM_DEFINITIONS[targetKey].label;

    console.log("Render DroppableInput");
    //const { isOver, canDrop, dropRef } = useVariableDrop({ id });

    const variables = useVariablesCollection();
    const { bindVariable, unbindVariable } = useVariablesStore(
        (state) => state
    );
    const variable = useVariablesStore(
        (state) => state.settings[state.settings[id].variableId]?.name
    );

    /* let borderColor = variable ? "fg.subtle" : "fg.info";
    let backgroundColor = variable ? "bg.muted" : "bg.info";
    if (isOver && canDrop) {
        borderColor = "fg.success";
        backgroundColor = "bg.success";
    } else if (isOver && !canDrop) {
        borderColor = "fg.error";
        backgroundColor = "bg.error";
    } */

    return (
        <Field
            label={
                showLabel ? label || PARAM_DEFINITIONS[targetKey]?.label : ""
            }
            maxW={"250px"}
            minW={"200px"}
        >
            <AutoComplete
                prefocusFirstItem={false}
                value={variable}
                onSelectOption={(selected) => {
                    unbindVariable(id);
                    if (!selected.item.value) return;
                    bindVariable(id, selected.item.value);
                }}
                filter={autocomleteFilter}
            >
                {({ isOpen, onOpen, onClose }) => (
                    <>
                        <AutoCompleteInput
                            autoFocus={forNode}
                            //ref={dropRef}
                            placeholder={
                                isOpen
                                    ? "Или перетащите переменную"
                                    : "Введите название переменной"
                            }
                            h={"32px"}
                            border={"1px solid"}
                            borderColor={"border"}
                            background={"transparent"}
                            //borderColor={borderColor}
                            borderRadius={"md"}
                            //backgroundColor={backgroundColor}
                            variant={"subtle"}
                            size={"xs"}
                            onClick={onOpen}
                            onBlur={(e) => {
                                //submit(e.target.value);
                                reset();
                                if (!e.target.value) {
                                    unbindVariable(id);
                                }
                                onClose();
                            }}
                            onFocus={(e) => e.currentTarget.select()}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    reset();
                                }
                                /* if (e.key === "Enter")
                                    submit(e.currentTarget.value); */
                            }}
                        />
                        {isOpen && (
                            <AutoCompleteList p={"0"} bg={"bg.default"}>
                                {variables?.items.map((row) => (
                                    <AutoCompleteItem
                                        m={"1"}
                                        key={row.id}
                                        value={row.id}
                                        label={row.value}
                                        gap={"4"}
                                        align={"center"}
                                        h={"24px"}
                                        borderRadius={"sm"}
                                        disabled={row.disabled}
                                    >
                                        <Text truncate>{row.label}</Text>
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
        </Field>
    );
});
