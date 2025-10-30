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

export const VariablesChoser = ({ noPortal= false }) => {
    const { data, isLoading, isError } = useVariables();

    const collection = useMemo(() => {
        return createListCollection({
            items: data ?? [],
        });
    }, [data]);

    const content = (
        <Select.Positioner>
            <Select.Content>
                {collection.items.map((row) => (
                    <Select.Item item={row} key={row.value}>
                        {row.label}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Positioner>
    );

    return (
        <Select.Root
            collection={collection}
            size={"xs"}
            multiple
            onValueChange={(value) => console.log("onValueChange", value)}
            disabled={isLoading || isError}
        >
            <Select.HiddenSelect />
            <Select.Label>Переменные:</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText
                        placeholder={isError ? "Ошибка" : "Выберите переменные"}
                    />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    {isLoading && (
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
            {noPortal ?  content: <Portal>{content}</Portal>}
        </Select.Root>
    );
};