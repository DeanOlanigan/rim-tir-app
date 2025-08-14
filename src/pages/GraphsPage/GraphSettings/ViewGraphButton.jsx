import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGraphStore } from "../GraphStore";

function ViewGraphButton() {
    console.log("Render ViewGraphButton");
    const navigate = useNavigate();

    const isWsActive = useGraphStore(state => state.isWsActiveZus);
    const offset = useGraphStore(state => state.offsetZus);
    const setStartDate = useGraphStore(state => state.startDateZus);
    const setEndDate = useGraphStore(state => state.setEndDate);

    const getWsMessage = useGraphStore(state => state.getWsMessageZus);

    const variables = useGraphStore(state => state.variablesZus);


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
