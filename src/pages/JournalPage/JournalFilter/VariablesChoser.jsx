import {
    createListCollection,
    Icon,
    Portal,
    Select,
    Spinner,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getConfiguration, QK } from "@/api";
import { useMemo } from "react";
import { LuTriangleAlert } from "react-icons/lu";

const useVariables = () => {
    const q = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => {
            const variables = Object.values(state.settings).filter(
                (node) => node.type === "variable" && node.setting.archive
            );
            const items = variables.map((v) => ({
                label: v.name,
                value: v.name,
            }));
            return items;
        },
    });

    return q;
};

export const VariablesChoser = () => {
    const { data, isFetching, isError } = useVariables();

    const collection = useMemo(() => {
        return createListCollection({
            items: data ?? [],
        });
    }, [data]);

    let placeholder = "Выберите переменные";
    if (collection.items.length === 0) placeholder = "Нет переменных";
    if (isFetching) placeholder = "Загрузка...";
    if (isError) placeholder = "Ошибка";

    return (
        <Select.Root
            collection={collection}
            size={"xs"}
            multiple
            disabled={isFetching || isError || collection.items.length === 0}
        >
            <Select.HiddenSelect />
            <Select.Label>Переменные:</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder={placeholder} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    {isFetching && (
                        <Spinner
                            size="xs"
                            borderWidth="1.5px"
                            color="fg.muted"
                        />
                    )}
                    {isError && (
                        <Icon as={LuTriangleAlert} color={"fg.error"} />
                    )}
                    <Select.ClearTrigger />
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {collection.items.map((row) => (
                            <Select.Item item={row} key={row.value}>
                                {row.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};
