import {
    useVariablesCollection,
    useVariablesCollectionMemo,
} from "@/hooks/useVariablesCollection";
import { useVariablesStore } from "@/store/variables-store";
import {
    useListCollection,
    useFilter,
    Portal,
    Combobox,
    Badge,
} from "@chakra-ui/react";
import { LuBan } from "react-icons/lu";

// TODO Доделать
export const ComboboxInput = ({ id }) => {
    const variables = useVariablesCollection();
    console.log(variables);
    /* const { contains } = useFilter({ sensitivity: "base" });
    const { collection, filter, set } = useListCollection({
        initialItems: variables,
        filter: contains,
        limit: 10,
    }); */

    const variableId = useVariablesStore(
        (state) => state.settings[id].variableId
    );
    const value = variableId ? [variableId] : [];

    const unbindVariable = useVariablesStore.getState().unbindVariable;
    const bindVariable = useVariablesStore.getState().bindVariable;

    /* const handleOpenChange = (e) => {
        if (e.open) {
            set(variables);
        }
    }; */

    const handleInputChange = (details) => {};

    return (
        <Combobox.Root
            lazyMount
            unmountOnExit
            openOnClick
            size={"xs"}
            collection={variables}
            onInputValueChange={handleInputChange}
            /* defaultValue={value}
            value={value} */
            onValueChange={(e) => {
                unbindVariable(id);
                if (!e.value[0]) return;
                bindVariable(id, e.value[0]);
            }}
            //onOpenChange={handleOpenChange}
        >
            <Combobox.Control>
                <Combobox.Input placeholder={"Введите название переменной"} />
                <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.Empty>Ничего не найдено</Combobox.Empty>
                        {variables.items.map((item) => (
                            <Combobox.Item item={item} key={item.value}>
                                <Combobox.ItemIndicator />
                                {item.label}
                                {item.disabled && (
                                    <Badge colorPalette={"red"}>
                                        <LuBan />
                                    </Badge>
                                )}
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
};
