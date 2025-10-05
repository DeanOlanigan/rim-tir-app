import { Button, Stack, ScrollArea, Badge } from "@chakra-ui/react";
import { GraphVariable } from "./GraphVariable";
import { useGraphStore } from "../../store/store";
import { getRandomColor } from "@/utils/utils";
import { LuPlus } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { getConfiguration, QK } from "@/api";

const shadowCss = {
    "--scroll-shadow-size": "4rem",
    maskImage:
        "linear-gradient(#000,#000,transparent 0,#000 var(--scroll-shadow-size),#000 calc(100% - var(--scroll-shadow-size)),transparent)",
    "&[data-at-top]": {
        maskImage:
            "linear-gradient(180deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
    },
    "&[data-at-bottom]": {
        maskImage:
            "linear-gradient(0deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
    },
};

const useVariables = () => {
    const q = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) => {
            const variables = Object.values(state.settings).filter(
                (node) => node.type === "variable"
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

const MAX_VARIABLES = 10;

export const VariablesManager = () => {
    const variables = useGraphStore((state) => state.variables);
    const { data, isLoading, isError } = useVariables();
    const { setVariable } = useGraphStore.getState();

    const handleClick = () => {
        if (Object.values(variables).length >= MAX_VARIABLES) return;
        setVariable({
            id: Date.now(),
            color: getRandomColor(),
            variableName: null,
        });
    };

    return (
        <Stack w={"100%"}>
            <Button
                size={"xs"}
                h={"44px"}
                variant={"subtle"}
                onClick={handleClick}
                disabled={Object.values(variables).length >= MAX_VARIABLES}
            >
                <LuPlus />
                Добавить переменную
                <Badge variant={"solid"}>{`${
                    Object.values(variables).length
                }/${MAX_VARIABLES}`}</Badge>
            </Button>
            <ScrollArea.Root size={"xs"} borderWidth={"1px"} rounded={"l2"}>
                <ScrollArea.Viewport css={shadowCss}>
                    <ScrollArea.Content spaceY={"2"} p={"2"}>
                        {isLoading && <div>Загрузка...</div>}
                        {Object.values(variables).map((variable) => (
                            <GraphVariable
                                key={variable.id}
                                id={variable.id}
                                data={data}
                            />
                        ))}
                    </ScrollArea.Content>
                    <ScrollArea.Scrollbar bg={"transparent"} />
                </ScrollArea.Viewport>
            </ScrollArea.Root>
        </Stack>
    );
};
