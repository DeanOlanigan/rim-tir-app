import { Badge, Icon } from "@chakra-ui/react";
import { LuCheck, LuX } from "react-icons/lu";
import { useParameters } from "../../pages/ConfigurationPage/Tree/NodeViews/getParameters";
import { memo } from "react";
import { validateVisibility } from "@/utils/validation";
import { isEmpty } from "@/utils/checkers";
import { iconsMap } from "@/config/icons";

function getColorPalette(value, settings) {
    const isBool = typeof settings[value.param] === "boolean";
    if (value.color) return value.color;
    if (isBool) {
        return value ? "green" : "red";
    }
    return "gray";
}

export const ParamViewer = memo(function ParamViewer({
    settings,
    path,
    isVariable,
    id,
}) {
    const paramValues = useParameters(path);

    return paramValues.map((value) => (
        <Param
            key={value.param}
            settings={settings}
            nodeId={id}
            value={value}
            isVariable={isVariable}
        />
    ));
});

const Param = ({ settings, nodeId, value, isVariable }) => {
    const isVisible = validateVisibility(value.visibleIf, nodeId, settings);
    const setting = settings[nodeId]?.setting;
    if (!isVisible || isEmpty(setting?.[value.param])) return null;
    return (
        <Badge
            key={value.param}
            title={value.label}
            variant="surface"
            size={"xs"}
            colorPalette={getColorPalette(value, settings)}
        >
            {typeof setting?.[value.param] === "boolean" ? (
                <BoolParamViewer
                    value={value}
                    param={setting?.[value.param]}
                    isVariable={isVariable}
                />
            ) : (
                setting?.[value.param]
            )}
        </Badge>
    );
};

const BoolParamViewer = ({ value, param, isVariable }) => {
    if (isVariable && value.icon) return <Icon as={iconsMap[value.icon]} />;
    if (value.shortname) return value.shortname;
    return param ? <LuCheck /> : <LuX />;
};
