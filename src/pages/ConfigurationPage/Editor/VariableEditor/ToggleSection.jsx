import { Flex } from "@chakra-ui/react";
import { CheckboxCard } from "../../../../components/ui/checkbox-card";
import {
    LuArchive,
    LuSquareTerminal,
    LuCode,
    LuRefreshCcwDot,
} from "react-icons/lu";
import { headerMapping } from "../../../MonitoringPage/mappings";
import { useVariablesStore } from "../../../../store/variables-store";
import { memo } from "react";

export const ToggleSection = memo(function ToggleSection(props) {
    console.log("Render ToggleSection");
    const { isSpecial, isLua, archive, cmd, id } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <Flex gap={"2"} wrap={"wrap"}>
            <CheckboxCard
                shadow={"md"}
                size={"md"}
                align={"center"}
                label={headerMapping["isSpecial"]}
                checked={isSpecial}
                onCheckedChange={(e) =>
                    setSettings(id, { isSpecial: !!e.checked })
                }
                icon={<LuRefreshCcwDot size={24} />}
                indicator={false}
                value={"isSpecial"}
            />
            <CheckboxCard
                shadow={"md"}
                size={"md"}
                align={"center"}
                label={headerMapping["archive"]}
                checked={archive}
                onCheckedChange={(e) =>
                    setSettings(id, { archive: !!e.checked })
                }
                icon={<LuArchive size={24} />}
                indicator={false}
                value={"archive"}
            />
            <CheckboxCard
                shadow={"md"}
                size={"md"}
                align={"center"}
                label={headerMapping["cmd"]}
                checked={cmd}
                onCheckedChange={(e) => setSettings(id, { cmd: !!e.checked })}
                icon={<LuSquareTerminal size={24} />}
                indicator={false}
                value={"cmd"}
            />
            <CheckboxCard
                shadow={"md"}
                size={"md"}
                align={"center"}
                label={headerMapping["isLua"]}
                checked={isLua}
                onCheckedChange={(e) => setSettings(id, { isLua: !!e.checked })}
                icon={<LuCode size={24} />}
                indicator={false}
                value={"isLua"}
            />
        </Flex>
    );
});
