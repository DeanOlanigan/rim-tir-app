import { Box, HStack, Heading, Text, Em } from "@chakra-ui/react";
import { InfoTip } from "../../components/ui/toggle-tip";
import { useLogContext } from "../../providers/LogProvider/LogContext";

function LogName() {
    const { logData } = useLogContext();

    return (
        <Box shadow={"md"} px={"2"} borderRadius={"sm"} border={"1px solid"} borderColor={"border"}>
            <HStack gap={"0"}>
                <Heading>{logData.name}</Heading>
                <InfoTip>
                    <Text>Дата создания: <Em>{logData.createdAt}</Em></Text>
                    <Text>Размер: <Em>{logData.size}</Em></Text>
                    <Text>Расположение: <Em>{logData.type.toLowerCase()}</Em></Text>
                    <Text>Изначальное количество строк: <Em>{logData.rows}</Em></Text>
                </InfoTip>
            </HStack>
        </Box>
    );
}

export default LogName;
