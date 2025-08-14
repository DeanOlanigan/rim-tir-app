import { HStack, Heading, Text, Em } from "@chakra-ui/react";
import { InfoTip } from "@/components/ui/toggle-tip";
import { useLogStore } from "../../LogStore/LogStore";

function LogName() {
    console.log("Render LogName");
    const logData = useLogStore(state => state.logDataZus);

    return (
        <HStack gap={"0"}>
            <Heading>{logData.logNameZus}</Heading>
            <InfoTip>
                <Text>
                    Дата создания: <Em>{logData.logCreationDateZus}</Em>
                </Text>
                <Text>
                    Размер: <Em>{logData.logSizeZus}</Em>
                </Text>
                <Text>
                    Расположение: <Em>{logData.logTypeZus.toLowerCase()}</Em>
                </Text>
            </InfoTip>
        </HStack>
    );
}

export default LogName;
