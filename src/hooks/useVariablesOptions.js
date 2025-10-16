import { useVariablesList } from "@/store/selectors";
import { createListCollection } from "@chakra-ui/react";
import { useMemo } from "react";

// TODO Вынести в селекторы
// TODO Заменить на реализацию через tanstack query
export function useVariablesOptions() {
    const variables = useVariablesList();

    return useMemo(() => {
        const items = variables.map((v) => ({ label: v.name, value: v.name }));
        return createListCollection({ items });
    }, [variables]);
}
