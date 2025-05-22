import { Tooltip } from "@/components/ui/tooltip";
import { CONSTANT_VALUES } from "@/config/constants";
import { locale } from "@/config/locale";
import { useLocaleStore } from "@/store/locale-store";
import { IconButton } from "@chakra-ui/react";
import { LuFilePlus, LuFolderPlus } from "react-icons/lu";

export const VariablesTitleButtons = ({ variableTreeRef }) => {
    const lang = useLocaleStore((state) => state.locale);
    return (
        <>
            <Tooltip content={locale[lang].createVariable}>
                <IconButton
                    size={"2xs"}
                    variant={"subtle"}
                    onClick={() => {
                        variableTreeRef?.current.create({
                            parentId: null,
                            type: {
                                nodeType: CONSTANT_VALUES.NODE_TYPES.variable,
                                times: 1,
                            },
                        });
                    }}
                >
                    <LuFilePlus />
                </IconButton>
            </Tooltip>
            <Tooltip content={locale[lang].createFolder}>
                <IconButton
                    size={"2xs"}
                    variant={"subtle"}
                    onClick={() => {
                        variableTreeRef?.current.create({
                            parentId: null,
                            type: {
                                nodeType: CONSTANT_VALUES.NODE_TYPES.folder,
                                times: 1,
                            },
                        });
                    }}
                >
                    <LuFolderPlus />
                </IconButton>
            </Tooltip>
        </>
    );
};
