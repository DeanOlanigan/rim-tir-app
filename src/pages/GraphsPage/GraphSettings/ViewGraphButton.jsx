import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useGraphStore } from "../store/store";
import { TIME_TYPE } from "./graphSettingsConstants";
import { useVariables } from "../useVariables";

export const ViewGraphButton = () => {
    const navigate = useNavigate();

    const { isLoading, isError } = useVariables();
    const offset = useGraphStore((state) => state.offset);
    const variables = useGraphStore((state) => state.variables);
    const varArr = Object.values(variables);
    const type = useGraphStore((state) => state.type);
    const { setStartDate, setEndDate, setShowGraph } = useGraphStore.getState();

    const isDisabled = varArr.some((v) => !v.name) || isLoading || isError;

    const setOffset = () => {
        setStartDate(new Date(Date.now() - offset * 1000).getTime());
        setEndDate(new Date(Date.now()).getTime());
    };

    const handleClick = () => {
        if (type === TIME_TYPE.real) setOffset();
        setShowGraph(true);
        navigate("/graph/viewer");
    };

    return (
        <Button
            disabled={isDisabled}
            shadow={"xl"}
            size={"xs"}
            onClick={handleClick}
        >
            Применить настройки и открыть график
        </Button>
    );
};
