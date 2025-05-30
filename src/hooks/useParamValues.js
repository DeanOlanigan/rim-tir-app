import { useVariablesStore } from "@/store/variables-store";
import { useShallow } from "zustand/shallow";

const VIEW_PARAMS = [
    "deviceAddress",
    "side",
    "asduAddress",
    "iface",
    "functionModbus",
    "type",
    "address",
    "gpioPort",
    "modbusDoAddress",
];
export function useParamValues(id) {
    return useVariablesStore(
        useShallow((state) =>
            VIEW_PARAMS.filter((key) => state.settings[id]?.setting?.[key]).map(
                (key) => state.settings[id]?.setting?.[key]
            )
        )
    );
}
