import { HStack, Text } from "@chakra-ui/react";
import { locale } from "@/config/locale";
import { useLocaleStore } from "@/store/locale-store";
import { TitleButtons } from "./TitleButtons/TitleButtons";

// TODO Зарефакторить TitleButtons
export const TreeCardTitle = ({ type, variableTreeRef }) => {
    const lang = useLocaleStore((state) => state.locale);
    return (
        <HStack justify={"space-between"}>
            <Text>{locale[lang][type] || type}</Text>
            <TitleButtons type={type} treeApi={variableTreeRef?.current} />
        </HStack>
    );
};
