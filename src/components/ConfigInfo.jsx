import { Flex, Text } from "@chakra-ui/react";
import { InfoTip } from "@/components/ui/toggle-tip";

export const ConfigInfo = ({ name, date, description }) => {
    return (
        <Flex gap={"2"}>
            <Text fontWeight={"medium"}>{name}</Text>
            <InfoTip lazyMount unmountOnExit>
                <Text fontWeight={"medium"}>Описание</Text>
                <Text maxW={"xs"} lineClamp={3}>
                    {description}
                </Text>
                <Text fontWeight={"medium"}>Дата изменения</Text>
                {new Date(parseInt(date)).toLocaleString()}
            </InfoTip>
        </Flex>
    );
};
