import { Flex, SimpleGrid } from "@chakra-ui/react";
import { BaseInput } from "../../InputComponents/BaseInput";
import { EditorBreadcrumb } from "../Breadcrumb";
import { DropComponent } from "./DropComponent";
import { resolveDynProps, checkDependsOn2 } from "../../../../utils/utils";
import { PARAM_DEFINITIONS } from "../../../../config/paramDefinitions";
import { useVariablesStore } from "../../../../store/variables-store";

export const DataObjectEditor = ({ data }) => {
    const settings = useVariablesStore((state) => state.settings);

    return (
        <Flex direction={"column"} gap={"4"} w={"100%"} h={"100%"} px={"1"}>
            <EditorBreadcrumb data={data} />
            <SimpleGrid columns={2} columnGap={"2"} rowGap={"2"} w={"100%"}>
                {Object.keys(data.setting).map((key, index) => {
                    if (key === "variable") return null;

                    const definition = PARAM_DEFINITIONS[key];
                    if (!definition) return null;

                    if (
                        definition.dependsOn &&
                        !checkDependsOn2(data, definition.dependsOn, settings)
                    ) {
                        return null;
                    }

                    const dynProps = resolveDynProps(
                        data,
                        definition.rules,
                        settings
                    );

                    return (
                        <BaseInput
                            key={index}
                            value={data.setting[key]}
                            id={data.id}
                            inputParam={key}
                            showLabel
                            {...dynProps}
                        />
                    );
                })}
            </SimpleGrid>
            <DropComponent id={data.id} variableId={data.variableId} />
        </Flex>
    );
};
