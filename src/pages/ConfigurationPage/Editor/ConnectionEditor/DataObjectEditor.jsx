import { SimpleGrid } from "@chakra-ui/react";
import { BaseInput } from "../../InputComponents/BaseInput";

export const DataObjectEditor = ({ data }) => {
    return (
        <SimpleGrid columns={2} columnGap={"2"} rowGap={"2"} w={"100%"}>
            {Object.keys(data.setting).map((key, index) => {
                //if (key === "variable") return null;

                return (
                    <BaseInput
                        key={index}
                        value={data.setting[key]}
                        id={data.id}
                        inputParam={key}
                        showLabel
                    />
                );
            })}
        </SimpleGrid>
    );
};
