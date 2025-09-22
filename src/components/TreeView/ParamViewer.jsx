import { Badge, Icon } from "@chakra-ui/react";
import { LuCheck, LuX } from "react-icons/lu";
import { useParameters } from "../../pages/ConfigurationPage/Tree/NodeViews/getParameters";
import { memo } from "react";

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
}) {
    const paramValues = useParameters(path);
    console.log(paramValues);

    return paramValues.map((value) =>
        settings?.[value.param] ? (
            <Badge
                key={value.param}
                title={value.label}
                variant="surface"
                size={"xs"}
                colorPalette={getColorPalette(value, settings)}
            >
                {typeof settings[value.param] === "boolean" ? (
                    <BoolParamViewer
                        value={value}
                        settings={settings}
                        isVariable={isVariable}
                    />
                ) : (
                    settings[value.param]
                )}
            </Badge>
        ) : null
    );
});

const BoolParamViewer = ({ value, settings, isVariable }) => {
    if (isVariable && value.icon) return <Icon as={value.icon} />;
    if (value.shortname) return value.shortname;
    return settings[value.param] ? <LuCheck /> : <LuX />;
};
