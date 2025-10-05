import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useGraphStore } from "../store/store";

export const ViewGraphButton = () => {
    const navigate = useNavigate();

    const offset = useGraphStore((state) => state.offset);
    const isRealTime = useGraphStore((state) => state.isRealTime);
    const setStartDate = useGraphStore.getState().setStartDate;
    const setEndDate = useGraphStore.getState().setEndDate;

    /* const isDisabled = !(
        variables.length > 0 &&
        variables.every(
            (variable) =>
                variable.color &&
                variable.variableMeasurement &&
                variable.variableName
        )
    ); */

    const setOffset = () => {
        setStartDate(new Date(Date.now() - offset * 1000).getTime());
        setEndDate(new Date(Date.now()).getTime());
    };

    const handleClick = () => {
        if (isRealTime) setOffset();
        navigate("/graph/viewer");
    };

    return (
        <Button disabled shadow={"xl"} size={"xs"} onClick={handleClick}>
            Применить настройки и открыть график
        </Button>
    );
};
