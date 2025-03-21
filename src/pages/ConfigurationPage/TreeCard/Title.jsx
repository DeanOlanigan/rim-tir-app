import { HStack, Text, IconButton, Icon } from "@chakra-ui/react";
import { Tooltip } from "../../../components/ui/tooltip";
import { LuFolderPlus, LuCopyMinus, LuFilePlus } from "react-icons/lu";
//import { CreateDataObjectMenu } from "./CreateDataObjectMenu";

export const TreeCardTitle = ({ type, variableTreeRef }) => {
    return (
        <HStack justify={"space-between"}>
            <Text>
                {type === "variables" && "Переменные"}
                {type === "send" && "Передача"}
                {type === "receive" && "Прием"}
            </Text>
            <HStack
                gap={"1"}
                opacity={"0"}
                transition={"opacity 0.2s ease-in-out"}
                _groupHover={{ opacity: 1 }}
            >
                {/* {(type === "send" || type === "receive") && (
                    <CreateDataObjectMenu variableTreeRef={variableTreeRef}/>
                )} */}
                {type === "variables" && (
                    <>
                        <Tooltip content={"Создать переменную..."}>
                            <IconButton
                                size={"2xs"}
                                variant={"subtle"}
                                onClick={() => {
                                    variableTreeRef?.current.create({
                                        type: "variable",
                                    });
                                }}
                            >
                                <Icon size={"sm"}>
                                    <LuFilePlus />
                                </Icon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip content={"Создать папку..."}>
                            <IconButton
                                size={"2xs"}
                                variant={"subtle"}
                                onClick={() => {
                                    variableTreeRef?.current.create({
                                        type: "folder",
                                    });
                                }}
                            >
                                <Icon size={"sm"}>
                                    <LuFolderPlus />
                                </Icon>
                            </IconButton>
                        </Tooltip>
                    </>
                )}
                <Tooltip content={"Свернуть папки"}>
                    <IconButton
                        size={"2xs"}
                        variant={"subtle"}
                        onClick={() => {
                            variableTreeRef?.current.closeAll();
                        }}
                    >
                        <Icon size={"sm"} transform={"scaleX(-1)"}>
                            <LuCopyMinus />
                        </Icon>
                    </IconButton>
                </Tooltip>
            </HStack>
        </HStack>
    );
};
