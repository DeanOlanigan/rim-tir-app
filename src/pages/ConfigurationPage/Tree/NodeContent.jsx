import { NodeEditInput } from "./NodeEditInput";
import { Icon, Text } from "@chakra-ui/react";
import { useVariablesStore } from "@/store/variables-store";
import { memo } from "react";
import {
    CONSTANT_VALUES,
    DEFAULT_CONFIGURATION_DATA,
} from "@/config/constants";
import { DroppableInput } from "@/pages/ConfigurationPage/InputComponents";
import { LuTriangleAlert } from "react-icons/lu";
import { useValidationStore } from "@/store/validation-store";
import { getParentType } from "@/utils/utils";
import { variable } from "@/config/testData";

const VIEW_PARAMS = {
    dataObject: ["address", "gpioPort", "modbusDoAddress"],
    variable: ["type"],
    functionGroup: ["functionModbus"],
    comport: ["iface"],
    asdu: ["asduAddress"],
    "modbus-rtu": ["deviceAddress"],
    iec104: ["side"],
};

export const NodeContent = memo(function NodeContent({ node }) {
    const { isEditing } = node;
    const { id, type, subType, name } = node.data;

    const variableName = useVariablesStore(
        (state) => state.settings[name]?.name
    );

    const validationErrors = useValidationStore((state) => state.errors?.[id]);

    // TODO Реализация отображения параметра - говно
    /* const setting = useVariablesStore(
        (state) => state.settings[id]?.setting || {}
    ); */

    /* const parentType = getParentType({ id, treeApi: node.tree });
    const viewParams =
        DEFAULT_CONFIGURATION_DATA.dataObject.nodeViewParam?.[parentType] || []; */

    /* const paramValues = Object.entries(setting)
        .filter(([key]) => viewParams.includes(key))
        .map(([_, value]) => value); */

    return isEditing ? (
        type === CONSTANT_VALUES.NODE_TYPES.dataObject ? (
            <DroppableInput
                targetKey={"variable"}
                id={id}
                submit={(value) => node.submit(value)}
                reset={() => node.reset()}
                forNode
            />
        ) : (
            <NodeEditInput
                name={name}
                submit={(value) => node.submit(value)}
                reset={() => node.reset()}
            />
        )
    ) : (
        <>
            {/* {type === CONSTANT_VALUES.NODE_TYPES.dataObject && (
                <Text color={"fg.muted"} fontSize={"xs"}>
                    {paramValues.join(", ")}
                </Text>
            )} */}
            <Text truncate>
                {type === CONSTANT_VALUES.NODE_TYPES.dataObject
                    ? variableName
                    : name}
            </Text>
            {validationErrors && (
                <Icon
                    color={"fg.error"}
                    as={LuTriangleAlert}
                    title={Object.values(Object.values(validationErrors)[0])
                        .flat()
                        .join("\n")}
                />
            )}
        </>
    );
});
