import { SimpleGrid } from "@chakra-ui/react";
import { InputController } from "../../InputComponents/InputController";
import { InputFactory } from "../../InputComponents/InputFactory";

export const ConnectionParamContainer = ({ data }) => {
    if (!data || !data.setting) {
        return null; // Возвращаем null, если нет данных или настроек
    }
    return (
        <SimpleGrid columns={4} columnGap={"2"} rowGap={"2"} w={"100%"}>
            {Object.keys(data.setting).map((key) => {
                return (
                    <InputController
                        key={data.id + "_" + key}
                        settingParam={key}
                        nodeId={data.id}
                        value={data.setting[key]}
                        Factory={InputFactory}
                        showLabel
                    />
                );
            })}
        </SimpleGrid>
    );
};
