import { Flex } from "@chakra-ui/react";
import { CheckboxCard } from "../../../../components/ui/checkbox-card";
import {
    LuArchive,
    LuSquareTerminal,
    LuCode,
    LuRefreshCcwDot,
    LuChartSpline,
} from "react-icons/lu";
import { useVariablesStore } from "../../../../store/variables-store";
import { memo } from "react";
import { PARAM_DEFINITIONS } from "../../../../config/paramDefinitions";

const iconMap = {
    isSpecial: LuRefreshCcwDot,
    isLua: LuCode,
    cmd: LuSquareTerminal,
    archive: LuArchive,
    graph: LuChartSpline,
};

const sizeParams = {
    sm: {
        shadow: "md",
        size: "xs",
        iconSize: 16,
        showLabel: false,
        w: "32px",
        h: "32px",
    },
    md: {
        shadow: "md",
        size: "md",
        iconSize: 24,
        showLabel: true,
    },
};

export const ToggleSection = memo(function ToggleSection(props) {
    //console.log("Render ToggleSection");
    const { graph, isSpecial, cmd, archive, id, size = "md" } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    const sizeProps = sizeParams[size];
    const checkboxes = {
        isSpecial,
        cmd,
        archive,
        graph,
    };

    return (
        <Flex gap={"2"} wrap={"wrap"}>
            {Object.keys(checkboxes).map((key) => {
                const IconComponent = iconMap[key];
                return (
                    <CheckboxCard
                        key={key}
                        minW={sizeProps.w}
                        minH={sizeProps.h}
                        maxW={sizeProps.w}
                        maxH={sizeProps.h}
                        shadow={sizeProps.shadow}
                        size={sizeProps.size}
                        label={
                            sizeProps.showLabel && PARAM_DEFINITIONS[key].label
                        }
                        icon={<IconComponent size={sizeProps.iconSize} />}
                        checked={checkboxes[key]}
                        align={"center"}
                        justify={"center"}
                        onCheckedChange={(e) =>
                            setSettings(id, { [key]: !!e.checked })
                        }
                        indicator={false}
                    />
                );
            })}
        </Flex>
    );
});
