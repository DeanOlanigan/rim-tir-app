import { HStack, Text, IconButton, Icon } from "@chakra-ui/react";
import { Tooltip } from "../../../components/ui/tooltip";
import { LuFolderPlus, LuCopyMinus, LuFilePlus, LuBan } from "react-icons/lu";
import { CONSTANT_VALUES } from "../../../config/constants";
import { locale } from "../../../config/locale";
import { useLocaleStore } from "../../../store/locale-store";
import { useVariablesStore } from "../../../store/variables-store";

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
    const toggleIgnoreNode = useVariablesStore((state) => state.ignoreNode);
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
            <Tooltip content={"Деактивировать узлы"}>
                <IconButton
                    size={"2xs"}
                    variant={"subtle"}
                    onClick={() => {
                        const ids = variableTreeRef?.current.root.children.map(
                            (child) => child.id
                        );
                        /* const ignore =
                            !variableTreeRef?.current.root.children[0].data
                                .isIgnored; */
                        toggleIgnoreNode(variableTreeRef?.current, ids, true);
                    }}
                >
                    <Icon size={"sm"} transform={"scaleX(-1)"}>
                        <LuBan />
                    </Icon>
                </IconButton>
            </Tooltip>
            <Tooltip content={"Свернуть узлы"}>
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
