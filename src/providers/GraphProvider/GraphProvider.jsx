import { useState, useCallback } from "react";
import { GraphContext } from "./GraphContext";
import PropTypes from "prop-types";
import { getStartDate, getEndDate, getRandomColor } from "../../utils/utils";

function GraphProvider({ children }) {
    const [maxPointsCount, setMaxPointsCount] = useState(100);
    const [isWsActive, setIsWsActive] = useState(true);
    const [offset, setOffset] = useState(120);
    const [startDate, setStartDate] = useState(getStartDate());
    const [endDate, setEndDate] = useState(getEndDate());

    const [variables, setVariables] = useState([]);
        
    const addVariable = useCallback(() => {
        setVariables((prevVars) => [
            ...prevVars,
            {
                id: Date.now(),
                color: getRandomColor(),
                variableName: "",
                variableMeasurement: ""
            }
        ]);
    }, []);

    const updateVariable = useCallback((index, updatedVariable) => {
        setVariables((prevVars) =>
            prevVars.map((variable, i) => (i === index ? updatedVariable : variable))
        );
    }, []);

    const removeVariable = useCallback((index) => {
        setVariables(prevVars => prevVars.filter((_, i) => i !== index));
    }, []);
    
    const createMessageForWS = () => ({
        graph: {
            maxPointsCount,
            isWsActive,
            offset,
            startDate,
            endDate,
            variables
        }
    });

    return (
        <GraphContext.Provider
            value={{
                maxPointsCount, setMaxPointsCount,
                isWsActive, setIsWsActive,
                offset, setOffset,
                startDate, setStartDate,
                endDate, setEndDate,
                createMessageForWS,
                variables, setVariables,
                addVariable, updateVariable, removeVariable
            }}
        >
            {children}
        </GraphContext.Provider>
    );
}
GraphProvider.propTypes = {
    children: PropTypes.node
};

export default GraphProvider;
