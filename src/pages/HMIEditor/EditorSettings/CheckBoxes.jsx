import { Checkbox } from "@chakra-ui/react";
import { useActionsStore } from "../store/actions-store";

const PARAMS = [
    { param: "snap", label: "Snap to grid", setter: "setSnap" },
    {
        param: "showPagesList",
        label: "Show pages list",
        setter: "setShowPagesList",
    },
    { param: "showGrid", label: "Show grid", setter: "setShowGrid" },
    /* {
        param: "clampToArea",
        label: "Clamp to work area",
        setter: "setClampToArea",
    }, */
    {
        param: "showNodesTree",
        label: "Show nodes tree",
        setter: "setShowNodesTree",
    },
    { param: "debugMode", label: "Debug mode", setter: "setDebugMode" },
    {
        param: "showHitRegions",
        label: "Show hit regions",
        setter: "setShowHitRegions",
    },
    {
        param: "showStartCoordMarker",
        label: "Show start coordinate marker",
        setter: "setShowStartCoordMarker",
    },
    {
        param: "viewOnlyMode",
        label: "View only mode",
        setter: "setViewOnlyMode",
    },
];

export const Checkboxes = () => {
    return PARAMS.map(({ param, label, setter }) => (
        <ParamCheckBox
            key={param}
            param={param}
            label={label}
            setter={setter}
        />
    ));
};

const ParamCheckBox = ({ param, label, setter }) => {
    const checked = useActionsStore((state) => state[param]);
    const set = useActionsStore.getState()[setter];

    return (
        <Checkbox.Root
            checked={checked}
            onCheckedChange={(e) => set(!!e.checked)}
        >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{label}</Checkbox.Label>
        </Checkbox.Root>
    );
};
