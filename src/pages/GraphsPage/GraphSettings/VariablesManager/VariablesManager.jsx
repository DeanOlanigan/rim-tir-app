import { Button, Stack, ScrollArea, Badge } from "@chakra-ui/react";
import { GraphVariable } from "./GraphVariable";
import { useGraphStore } from "../../store/store";
import { getRandomColor } from "@/utils/utils";
import { LuPlus } from "react-icons/lu";
import { Loader } from "@/components/Loader";
import { ErrorInformer } from "@/components/ErrorInformer";
import { useVariables } from "../../useVariables";

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

const MAX_VARIABLES = 10;

export const VariablesManager = () => {
    const { data, isError, error, isFetching } = useVariables();

    if (isFetching) {
        useGraphStore.getState().resetVariables();
    }

    return (
        <Stack w={"100%"}>
            <AddVarButton
                isFetching={isFetching}
                isError={isError}
                data={data}
            />
            <ScrollArea.Root size={"xs"} borderWidth={"1px"} rounded={"l2"}>
                <ScrollArea.Viewport css={shadowCss}>
                    <ScrollArea.Content spaceY={"2"} p={"2"}>
                        <VariablesContent
                            isFetching={isFetching}
                            isError={isError}
                            error={error}
                            data={data}
                        />
                    </ScrollArea.Content>
                    <ScrollArea.Scrollbar bg={"transparent"} />
                </ScrollArea.Viewport>
            </ScrollArea.Root>
        </Stack>
    );
};

const AddVarButton = ({ isFetching, isError, data }) => {
    const varLength = useGraphStore(
        (state) => Object.keys(state.variables).length
    );
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
            loading={isFetching}
            loadingText={"Загрузка..."}
            onClick={handleClick}
            disabled={
                varLength >= MAX_VARIABLES || isError || data?.length === 0
            }
            colorPalette={isError && "red"}
        >
            <AddVarButtonContent
                isError={isError}
                data={data}
                varLength={varLength}
            />
        </Button>
    );
};

const AddVarButtonContent = ({ isError, data, varLength }) => {
    if (isError) return "Ошибка";
    if (data?.length === 0) return "В конфигурации нет подходящих переменных";
    return (
        <>
            <LuPlus />
            Добавить переменную
            <Badge variant={"solid"}>{`${varLength}/${MAX_VARIABLES}`}</Badge>
        </>
    );
};

const VariablesContent = ({ isFetching, isError, error, data }) => {
    const variables = useGraphStore((state) => state.variables);
    if (isFetching) return <Loader text={"Загрузка..."} />;
    if (isError) return <ErrorInformer error={error} />;
    return Object.values(variables).map((variable) => (
        <GraphVariable key={variable.id} id={variable.id} data={data} />
    ));
};
