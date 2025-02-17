import { Flex, Icon } from "@chakra-ui/react";
import { CheckboxCard } from "../../../components/ui/checkbox-card";
import { LuArchive, LuSquareTerminal, LuCode, LuRefreshCcwDot } from "react-icons/lu";
import { headerMapping } from "../../MonitoringPage/mappings";

export const ToggleSection = ({data, setIsLuaBlockVisible, setIsSpecialBlockVisible}) => {
    return (
        <Flex gap={"2"} wrap={"wrap"}>
            <CheckboxCard
                size={"md"}
                align={"center"}
                label={headerMapping["isSpecial"]}
                checked={data.setting.isSpecial}
                onChange={() =>
                    setIsSpecialBlockVisible((prev) => !prev)
                }
                icon={
                    <Icon size={"lg"}>
                        <LuRefreshCcwDot />
                    </Icon>
                }
                indicator={false}
            />
            <CheckboxCard
                size={"md"}
                align={"center"}
                label={headerMapping["archive"]}
                checked={data.setting.archive}
                icon={
                    <Icon size={"lg"}>
                        <LuArchive />
                    </Icon>
                }
                indicator={false}
            />
            <CheckboxCard
                size={"md"}
                align={"center"}
                label={headerMapping["cmd"]}
                checked={data.setting.cmd}
                icon={
                    <Icon size={"lg"}>
                        <LuSquareTerminal />
                    </Icon>
                }
                indicator={false}
            />
            <CheckboxCard
                size={"md"}
                align={"center"}
                label={headerMapping["isLua"]}
                checked={data.setting.isLua}
                onChange={() =>
                    setIsLuaBlockVisible((prev) => !prev)
                }
                icon={
                    <Icon size={"lg"}>
                        <LuCode />
                    </Icon>
                }
                indicator={false}
            />
        </Flex>
    );
};
