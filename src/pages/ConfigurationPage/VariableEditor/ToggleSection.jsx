import { Flex, Icon, CheckboxGroup } from "@chakra-ui/react";
import { CheckboxCard } from "../../../components/ui/checkbox-card";
import { LuArchive, LuSquareTerminal, LuCode, LuRefreshCcwDot } from "react-icons/lu";
import { headerMapping } from "../../MonitoringPage/mappings";
import { useVariablesStore } from "../../../store/variables-store";

/* const getActiveCheckboxes = (checboxes) => {
    const arr = [];
    Object.keys(checboxes).map((key) => {
        return checboxes[key] ? arr.push(key) : null;
    });
    return arr;
}; */

export const ToggleSection = ({ data }) => {
    const setSettings = useVariablesStore((state) => state.setSettings);
    
    /* const checkboxes = {
        isSpecial: data.setting.isSpecial,
        archive: data.setting.archive,
        cmd: data.setting.cmd,
        isLua: data.setting.isLua,
    };

    const activeCheckboxes = getActiveCheckboxes(checkboxes); */

    return (
        //<CheckboxGroup defaultValue={activeCheckboxes}>
        <Flex gap={"2"} wrap={"wrap"}>
            <CheckboxCard
                shadow={"md"}
                size={"md"}
                align={"center"}
                label={headerMapping["isSpecial"]}
                checked={data.isSpecial}
                onCheckedChange={(e) => 
                    setSettings(data.id, { isSpecial: !!e.checked })
                }
                icon={
                    <LuRefreshCcwDot size={24}/>
                }
                indicator={false}
                value={"isSpecial"}
            />
            <CheckboxCard
                shadow={"md"}
                size={"md"}
                align={"center"}
                label={headerMapping["archive"]}
                checked={data.archive}
                onCheckedChange={(e) => 
                    setSettings(data.id, { archive: !!e.checked })
                }
                icon={
                    <LuArchive size={24}/>
                }
                indicator={false}
                value={"archive"}
            />
            <CheckboxCard
                shadow={"md"}
                size={"md"}
                align={"center"}
                label={headerMapping["cmd"]}
                checked={data.cmd}
                onCheckedChange={(e) => 
                    setSettings(data.id, { cmd: !!e.checked })
                }
                icon={
                    <LuSquareTerminal size={24}/>
                }
                indicator={false}
                value={"cmd"}
            />
            <CheckboxCard
                shadow={"md"}
                size={"md"}
                align={"center"}
                label={headerMapping["isLua"]}
                checked={data.isLua}
                onCheckedChange={(e) => 
                    setSettings(data.id, { isLua: !!e.checked })
                }
                icon={
                    <LuCode size={24}/>
                }
                indicator={false}
                value={"isLua"}
            />
        </Flex>
        //</CheckboxGroup>
    );
};
