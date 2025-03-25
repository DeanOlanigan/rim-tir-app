import { HStack, Text, IconButton, Icon } from "@chakra-ui/react";
import { Tooltip } from "../../../components/ui/tooltip";
import { LuFolderPlus, LuCopyMinus, LuFilePlus } from "react-icons/lu";
import { CONSTANT_VALUES } from "../../../config/constants";
import { locale } from "../../../config/locale";
import { useLocaleStore } from "../../../store/locale-store";

export const TreeCardTitle = ({ type, variableTreeRef }) => {
    const lang = useLocaleStore((state) => state.locale);
    return (
        <HStack justify={"space-between"}>
            <Text>{locale[lang][type] || type}</Text>
            <TitleButtons type={type} variableTreeRef={variableTreeRef} />
        </HStack>
    );
};

const TitleButtons = ({ type, variableTreeRef }) => {
    return (
        <HStack
            gap={"1"}
            opacity={"0"}
            transition={"opacity 0.2s ease-in-out"}
            _groupHover={{ opacity: 1 }}
        >
            {type === CONSTANT_VALUES.TREE_TYPES.variables && (
                <VariablesTitleButtons variableTreeRef={variableTreeRef} />
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
    );
};

const VariablesTitleButtons = ({ variableTreeRef }) => {
    const lang = useLocaleStore((state) => state.locale);
    return (
        <>
            <Tooltip content={locale[lang].createVariable}>
                <IconButton
                    size={"2xs"}
                    variant={"subtle"}
                    onClick={() => {
                        variableTreeRef?.current.create({
                            type: CONSTANT_VALUES.NODE_TYPES.variable,
                        });
                    }}
                >
                    <Icon size={"sm"}>
                        <LuFilePlus />
                    </Icon>
                </IconButton>
            </Tooltip>
            <Tooltip content={locale[lang].createFolder}>
                <IconButton
                    size={"2xs"}
                    variant={"subtle"}
                    onClick={() => {
                        variableTreeRef?.current.create({
                            type: CONSTANT_VALUES.NODE_TYPES.folder,
                        });
                    }}
                >
                    <Icon size={"sm"}>
                        <LuFolderPlus />
                    </Icon>
                </IconButton>
            </Tooltip>
        </>
    );
};
