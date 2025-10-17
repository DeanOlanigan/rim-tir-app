import { Button } from "@chakra-ui/react";
import { useGraphStore, useVariablesList } from "../store/store";
import { TIME_TYPE } from "./graphSettingsConstants";
import { useVariables } from "../useVariables";

export const ViewGraphButton = () => {
    const { isFetching, isError } = useVariables();
    const offset = useGraphStore((state) => state.offset);
    const varArr = useVariablesList();
    const type = useGraphStore((state) => state.type);
    const { setStartDate, setEndDate, setShowGraph } = useGraphStore.getState();

    const isDisabled =
        varArr.length === 0 ||
        varArr.some((v) => !v.name) ||
        isFetching ||
        isError;

    const handleClick = () => {
        if (type === TIME_TYPE.real) {
            const now = Date.now();
            setStartDate(now - offset * 1000);
            setEndDate(now);
        }
        setShowGraph(true);
    };

    return (
        <Button
            disabled={isDisabled}
            shadow={"xl"}
            size={"xs"}
            onClick={handleClick}
            flex={1}
        >
            Применить настройки и открыть график
        </Button>
    );
};
