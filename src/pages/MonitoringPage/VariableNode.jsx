import { DefaultView } from "../../components/TreeView/DefaultView";
import { Flex, IconButton, Text, Stack, HStack, StackSeparator, Box, Code, Icon } from "@chakra-ui/react";
import {
    LuVariable,
    LuLightbulb,
    LuCircle,
    LuPencil,
    LuUserCheck,
    LuInfo,
    LuArrowBigRight,
} from "react-icons/lu";
import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
} from "../../components/ui/popover";
import { Field } from "../../components/ui/field";
import { Tooltip } from "../../components/ui/tooltip";
import { headerMapping, valueMapping } from "./mappings";
import { memo } from "react";

const ConnectionHeadderAdditionalInfo =({protocol}) => {
    const { id: _, ...rest } = protocol;

    return (
        <PopoverRoot positioning={{placement: "left-center"}} lazyMount unmountOnExit>
            <PopoverTrigger asChild>
                <IconButton size={"2xs"} variant={"subtle"}>
                    <LuInfo />
                </IconButton>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverBody>
                    <Stack gap={"1"} separator={<StackSeparator />}>
                        {
                            Object.keys(rest).map((key, index) => {
                                return (
                                    <Field key={index} label={headerMapping[key]}>
                                        <Box maxH={"100px"} overflow={"auto"}>
                                            <Text wordBreak={"break-all"} fontSize={"sm"}>{valueMapping[rest[key]] || rest[key].toString()}</Text>
                                        </Box>
                                    </Field>
                                );
                            })
                        }
                    </Stack>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
};

export const VariableNode = memo(function VariableNode({type, subType, setting, editable}) {
    console.log("Render VariableNode");

    if (type === "dataObject" || type === "variable") return (
        <Flex
            direction={"row"}
            align={"center"}
            justify={"space-between"}
            gap={"2"}
            w={"100%"}
        >
            <HStack>
                <LuVariable />
                <HStack>
                    <Tooltip content={setting?.name || setting?.variable}>
                        <Text truncate maxW={"100px"}>
                            { setting?.name || setting?.variable}
                        </Text>
                    </Tooltip>
                    <ConnectionHeadderAdditionalInfo protocol={setting}/>
                </HStack>
                <Code w={"150px"} variant={"surface"} justifyContent={"center"}>{ setting?.value }</Code>
                { editable && (
                    <IconButton size={"2xs"} variant={"subtle"}>
                        <LuPencil />
                    </IconButton>
                )}
            </HStack>
            <HStack>
                <LuUserCheck />
                <Icon color={"red.500"} fill={"red.500"}>
                    <LuArrowBigRight/>
                </Icon>
                <LuLightbulb />
                <LuCircle />
            </HStack>
        </Flex>
    );

    return (
        <DefaultView type={type} subType={subType} setting={setting}/>
    );
});
