import { Flex, HStack, Box, Heading, Icon } from "@chakra-ui/react";
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "../../../components/ui/select";
import { CheckboxCard } from "../../../components/ui/checkbox-card";
import { 
    LuArchive,
    LuSquareTerminal
} from "react-icons/lu";
import { dataTypes, groups } from "../filterOptions";
import { headerMapping } from "../../MonitoringPage/mappings";

export const MultipleVariableEditor = ({data}) => {
    console.log("Render MultipleVariableEditor");

    return (
        <Flex
            mt={"2"}
            direction={"column"}
            gap={"4"}
            w={"100%"}
            h={"100%"}
            px={"1"}
        >
            <HStack
                border={"1px solid"}
                borderColor={"border"}
                borderRadius={"md"}
                shadow={"md"}
                p={"4"}
            >
                <Heading>Изменение смежных параметров переменных</Heading>
            </HStack>
            <Box
                w={"100%"}
                maxW={"6xl"}
                overflow={"auto"}
                border={"1px solid"}
                borderColor={"border"}
                borderRadius={"md"}
                shadow={"md"}
                p={"2"}
            >
                <Flex gap={"2"} wrap={"wrap"}>
                    <CheckboxCard
                        size={"md"}
                        align={"center"}
                        label={headerMapping["archive"]}
                        defaultValue={data.data.setting.archive}
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
                        defaultValue={data.data.setting.cmd}
                        icon={
                            <Icon size={"lg"}>
                                <LuSquareTerminal />
                            </Icon>
                        }
                        indicator={false}
                    />
                </Flex>
                <Flex gap={"2"} p={"2"}>
                    <SelectRoot size={"xs"} collection={dataTypes}>
                        <SelectLabel>{headerMapping["type"]}</SelectLabel>
                        <SelectTrigger>
                            <SelectValueText placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                            {dataTypes.items.map((row) => (
                                <SelectItem item={row} key={row.value}>
                                    {row.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </SelectRoot>
                    <SelectRoot size={"xs"} collection={groups}>
                        <SelectLabel>{headerMapping["group"]}</SelectLabel>
                        <SelectTrigger>
                            <SelectValueText placeholder="Выберите группу" />
                        </SelectTrigger>
                        <SelectContent>
                            {groups.items.map((row) => (
                                <SelectItem item={row} key={row.value}>
                                    {row.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </SelectRoot>
                </Flex>
            </Box>
        </Flex>
    );
};
