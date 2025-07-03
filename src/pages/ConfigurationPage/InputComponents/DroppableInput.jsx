//***************************************************************************//
//                                                                           //
//                              DEPRECATED                                   //
//                                                                           //
//***************************************************************************//

import { memo } from "react";
import { useVariablesStore } from "@/store/variables-store";
import { Badge, Flex, Text } from "@chakra-ui/react";
import { useVariablesCollection } from "@/hooks/useVariablesCollection";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { LuBan } from "react-icons/lu";

const autocomleteFilter = (query, optionValue, optionLabel) => {
    const lowerCaseQuery = query.toLowerCase();
    const lowerCaseOptionLabel = optionLabel.toLowerCase();
    return lowerCaseOptionLabel.indexOf(lowerCaseQuery) !== -1;
};

// TODO В Chakra ui появился свой компонент, переписать

const test = ["Переменная 1", "Переменная 2", "Переменная 3"];

export const DroppableInput = memo(function DroppableInput(props) {
    const {
        id,
        targetKey,
        submit = () => {},
        reset = () => {},
        forNode = false,
        ...rest
    } = props;

    console.log("Render DroppableInput");
    // TODO variables ререндерит компонент при каждом изменении
    const variables = useVariablesCollection();
    const bindVariable = useVariablesStore((state) => state.bindVariable);
    const unbindVariable = useVariablesStore((state) => state.unbindVariable);
    const variable = useVariablesStore(
        (state) => state.settings[state.settings[id].variableId]?.name
    );
    return (
        <AutoComplete
            prefocusFirstItem={false}
            value={variable}
            onSelectOption={(selected) => {
                unbindVariable(id);
                if (!selected.item.value) return;
                bindVariable(id, selected.item.value);
            }}
            filter={autocomleteFilter}
            emptyState={<Empty />}
        >
            {({ isOpen, onOpen, onClose }) => (
                <>
                    <AutoCompleteInput
                        autoComplete="off"
                        autoFocus={forNode}
                        placeholder={"Введите название переменной"}
                        h={forNode ? "24px" : "32px"}
                        border={"1px solid"}
                        borderColor={"border"}
                        background={"transparent"}
                        borderRadius={"sm"}
                        variant={"subtle"}
                        size={"xs"}
                        onClick={onOpen}
                        onBlur={(e) => {
                            //submit(e.target.value);
                            //reset();
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
                                    title={
                                        row.disabled
                                            ? "Используется"
                                            : row.value
                                    }
                                    justifyContent={"space-between"}
                                >
                                    <Text truncate>{row.label}</Text>
                                    {row.disabled && (
                                        <Badge colorPalette={"red"}>
                                            <LuBan />
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

const Empty = () => {
    return (
        <Flex h={"32px"} align={"center"} justify={"center"}>
            <Text fontWeight={"medium"}>Ничего не найдено</Text>
        </Flex>
    );
};
