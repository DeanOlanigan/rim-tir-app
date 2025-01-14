import { useReducer, useMemo } from "react";
import { JournalContext } from "./JournalContext";
import PropTypes from "prop-types";
import { defaultFilters } from "../../pages/JournalPage/JournalFilter/filterOprions";

function initialState() {
    return {
        isPaused: false,
        journalHeaders: [],
        journalRows: [],
        pausedJournalRows: [],
        filters: defaultFilters
    };
};

function reducer(state, action) {
    switch (action.type) {
    case "SET_PAUSED":
        return {
            ...state,
            isPaused: action.payload,
            pausedJournalRows: []
        };
    case "ADD_ROWS":
        if (state.isPaused) {
            return {
                ...state,
                pausedJournalRows: [...state.pausedJournalRows, ...action.payload],
            };
        }
        return {
            ...state,
            journalRows: [...state.journalRows, ...action.payload],
        };
    case "CLEAR_ROWS":
        return {
            ...state,
            journalRows: [],
            pausedJournalRows: [],
        };
    case "SET_FILTERS":
        return {
            ...state,
            filters: action.payload
        };
    default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
}

function JournalProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, undefined, initialState);

    const value = useMemo(() => ({
        ...state,
        setIsPaused: (isPaused) => dispatch({ type: "SET_PAUSED", payload: isPaused }),
        setJournalRows: (journalRows) => dispatch({ type: "ADD_ROWS", payload: journalRows }),
        clearJournalRows: () => dispatch({ type: "CLEAR_ROWS" }),
        setFilters: (filters) => dispatch({type: "SET_FILTERS", payload: filters})
    }), [state]);

    return (
        <JournalContext.Provider value={value}>
            {children}
        </JournalContext.Provider>
    );
}
JournalProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default JournalProvider;
