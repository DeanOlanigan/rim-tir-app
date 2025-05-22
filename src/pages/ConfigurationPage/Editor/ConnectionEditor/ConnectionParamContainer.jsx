import { SimpleGrid } from "@chakra-ui/react";
import {
    BaseInput,
    InputController,
} from "@/pages/ConfigurationPage/InputComponents";

export const ConnectionParamContainer = ({ data }) => {
    return (
        <SimpleGrid columns={4} columnGap={"2"} rowGap={"2"} w={"100%"}>
            {Object.keys(data.setting).map((key) => {
                return (
                    <InputController
                        key={data.id + "_" + key}
                        inputType={key}
                        inputId={data.id}
                        value={data.setting[key]}
                        Factory={BaseInput}
                        showLabel
                    />
                );
            })}
        </SimpleGrid>
    );
};
