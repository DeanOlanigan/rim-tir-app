import { HStack, Icon } from "@chakra-ui/react";
import { CheckboxCard } from "../../../../../components/ui/checkbox-card";
import {
    LuArchive,
    LuCode,
    LuRefreshCcwDot,
    LuSquareTerminal,
} from "react-icons/lu";
import { useVariablesStore } from "../../../../../store/variables-store";
import { memo } from "react";

export const TableCheckboxCardGroupCell = memo(
    function TableCheckboxCardGroupCell(props) {
        console.log("Render TableCheckboxCardGroupCell");
        const { isSpecial, isLua, archive, cmd, id } = props;
        const setSettings = useVariablesStore((state) => state.setSettings);

        return (
            <HStack>
                <CheckboxCard
                    w={"32px"}
                    h={"32px"}
                    size={"xs"}
                    align={"center"}
                    justify={"center"}
                    checked={isSpecial}
                    onCheckedChange={(e) => {
                        setSettings(id, {
                            isSpecial: !!e.checked,
                        });
                    }}
                    icon={
                        <Icon size={"sm"}>
                            <LuRefreshCcwDot />
                        </Icon>
                    }
                    indicator={false}
                />
                <CheckboxCard
                    w={"32px"}
                    h={"32px"}
                    size={"xs"}
                    align={"center"}
                    justify={"center"}
                    checked={archive}
                    onCheckedChange={(e) => {
                        setSettings(id, {
                            archive: !!e.checked,
                        });
                    }}
                    icon={
                        <Icon size={"sm"}>
                            <LuArchive />
                        </Icon>
                    }
                    indicator={false}
                />
                <CheckboxCard
                    w={"32px"}
                    h={"32px"}
                    size={"xs"}
                    align={"center"}
                    justify={"center"}
                    checked={cmd}
                    onCheckedChange={(e) => {
                        setSettings(id, {
                            cmd: !!e.checked,
                        });
                    }}
                    icon={
                        <Icon size={"sm"}>
                            <LuSquareTerminal />
                        </Icon>
                    }
                    indicator={false}
                />
                <CheckboxCard
                    w={"32px"}
                    h={"32px"}
                    size={"xs"}
                    align={"center"}
                    justify={"center"}
                    checked={isLua}
                    onCheckedChange={(e) => {
                        setSettings(id, {
                            isLua: !!e.checked,
                        });
                    }}
                    icon={
                        <Icon size={"sm"}>
                            <LuCode />
                        </Icon>
                    }
                    indicator={false}
                />
            </HStack>
        );
    }
);
