import { Button, Stack, ScrollArea, Badge } from "@chakra-ui/react";
import { GraphVariable } from "./GraphVariable";
import { useGraphStore } from "../../store/store";
import { getRandomColor } from "@/utils/utils";
import { LuPlus } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { getConfiguration, QK } from "@/api";
import { Loader } from "@/components/Loader";
import { ErrorInformer } from "@/components/ErrorInformer";

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
                (node) => node.type === "variable" && node.setting.graph
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
    const varLength = Object.values(variables).length;
    const { data, isLoading, isError, error } = useVariables();

    return (
        <Stack w={"100%"}>
            <AddVarButton
                isLoading={isLoading}
                isError={isError}
                varLength={varLength}
            />
            <ScrollArea.Root size={"xs"} borderWidth={"1px"} rounded={"l2"}>
                <ScrollArea.Viewport css={shadowCss}>
                    <ScrollArea.Content spaceY={"2"} p={"2"}>
                        <VariablesContent
                            isLoading={isLoading}
                            isError={isError}
                            error={error}
                            variables={variables}
                            data={data}
                        />
                    </ScrollArea.Content>
                    <ScrollArea.Scrollbar bg={"transparent"} />
                </ScrollArea.Viewport>
            </ScrollArea.Root>
        </Stack>
    );
};

const AddVarButton = ({ isLoading, isError, varLength }) => {
    const { addVariable } = useGraphStore.getState();
    const handleClick = () => {
        if (varLength >= MAX_VARIABLES) return;
        addVariable({
            id: Date.now(),
            color: getRandomColor(),
            name: null,
        });
    };

    return (
        <Button
            size={"xs"}
            h={"44px"}
            variant={"subtle"}
            loading={isLoading}
            loadingText={"Загрузка..."}
            onClick={handleClick}
            disabled={varLength >= MAX_VARIABLES || isError}
            colorPalette={isError && "red"}
        >
            {isError ? (
                "Ошибка"
            ) : (
                <>
                    <LuPlus />
                    Добавить переменную
                    <Badge
                        variant={"solid"}
                    >{`${varLength}/${MAX_VARIABLES}`}</Badge>
                </>
            )}
        </Button>
    );
};

const VariablesContent = ({ isLoading, isError, error, variables, data }) => {
    if (isLoading) return <Loader text={"Загрузка..."} />;
    if (isError) return <ErrorInformer error={error} />;
    return Object.values(variables).map((variable) => (
        <GraphVariable key={variable.id} id={variable.id} data={data} />
    ));
};
