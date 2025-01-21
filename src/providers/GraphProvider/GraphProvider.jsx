import { useState } from "react";
import { GraphContext } from "./GraphContext";
import PropTypes from "prop-types";

const startDate = new Date();
startDate.setDate(startDate.getDate() - 3);
startDate.setMinutes(Math.round(startDate.getMinutes() / 15) * 15);

const endDate = new Date();
endDate.setDate(endDate.getDate());
endDate.setMinutes(Math.round(endDate.getMinutes() / 15) * 15);

const getRandomColor = () => {
    return ("#" + (Math.random().toString(16) + "000000").slice(2, 8).toUpperCase());
};

function GraphProvider({ children }) {
    const [graphData, setGraphData] = useState({
        maxPointsCount: 100,
        isWsActive: true,
        offset: 120,
        startDate: startDate,
        endDate: endDate
    });
    const [vars, setVars] = useState([]);

    const updateGraphData = (data) => {
        setGraphData((prev) => ({...prev, ...data}));
    };

    const addVariable = () => {
        setVars((prev) => [...prev, {
            color: getRandomColor(),
            variableName: "",
            variableMeasurement: ""
        }]);
    };

    return (
        <GraphContext.Provider
            value={{
                graphData,
                maxPointsCount: graphData.maxPointsCount,
                isWsActive: graphData.isWsActive,
                offset: graphData.offset,
                startDate: graphData.startDate,
                endDate: graphData.endDate,
                variables: graphData.variables,
                setGraphData,
                updateGraphData,
                vars,
                setVars,
                addVariable
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
