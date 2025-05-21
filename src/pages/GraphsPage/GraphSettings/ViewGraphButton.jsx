import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import {
    startDateAtom,
    endDateAtom,
    offsetAtom,
    isWsActiveAtom,
    getWsMessageAtom,
    variablesAtom,
} from "../atoms";

function ViewGraphButton() {
    console.log("Render ViewGraphButton");
    const navigate = useNavigate();

    const isWsActive = useAtomValue(isWsActiveAtom);
    const offset = useAtomValue(offsetAtom);
    const setStartDate = useSetAtom(startDateAtom);
    const setEndDate = useSetAtom(endDateAtom);

    const [, getWsMessage] = useAtom(getWsMessageAtom);

    const variables = useAtomValue(variablesAtom);
    const isDisabled = !(
        variables.length > 0 &&
        variables.every(
            (variable) =>
                variable.color &&
                variable.variableMeasurement &&
                variable.variableName
        )
    );

    const setOffset = () => {
        const nowTime = new Date(Date.now()).getTime();
        const offsetTime = new Date(Date.now() - offset * 1000).getTime();
        setStartDate(offsetTime);
        setEndDate(nowTime);
    };

    return (
        <Button
            disabled={isDisabled}
            shadow={"xl"}
            size={"xs"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{ _open: "scale-fade-in" }}
            onClick={() => {
                if (isWsActive) setOffset();
                getWsMessage();
                navigate("/graph/viewer");
            }}
        >
            Применить настройки и открыть график
        </Button>
    );
}
export default ViewGraphButton;
