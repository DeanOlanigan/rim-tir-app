import { HStack, Heading, Text, Em, FormatByte } from "@chakra-ui/react";
import { InfoTip } from "@/components/ui/toggle-tip";
import { useLogStore } from "../../store/store";

export const LogName = () => {
    const chosenLog = useLogStore((state) => state.chosenLog);

    return (
        <HStack gap={"0"}>
            <Heading>{chosenLog.label}</Heading>
            <InfoTip>
                <Text>
                    Дата создания:{" "}
                    <Em>{new Date(chosenLog.mtime).toLocaleString()}</Em>
                </Text>
                <Text>
                    Размер:{" "}
                    <Em>
                        <FormatByte value={chosenLog.size} />
                    </Em>
                </Text>
                <Text>
                    Расположение: <Em>{chosenLog.category}</Em>
                </Text>
            </InfoTip>
        </HStack>
    );
};
