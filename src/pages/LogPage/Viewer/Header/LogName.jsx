import { HStack, Heading, Text, Em } from "@chakra-ui/react";
import { InfoTip } from "../../../../components/ui/toggle-tip";
import { useLogContext } from "../../../../providers/LogProvider/LogContext";

function LogName() {
    console.log("Render LogName");
    const { logData } = useLogContext();

    return (
        <HStack gap={"0"}>
            <Heading>{logData.name}</Heading>
            <InfoTip>
                <Text>Дата создания: <Em>{logData.createdAt}</Em></Text>
                <Text>Размер: <Em>{logData.size}</Em></Text>
                <Text>Расположение: <Em>{logData.type.toLowerCase()}</Em></Text>
            </InfoTip>
        </HStack>
    );
}

export default LogName;
