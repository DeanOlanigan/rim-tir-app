import { Table } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "../../../../../config/paramDefinitions";
import { BaseInput } from "../../../InputComponents/BaseInput";
import { TypeCell } from "../../VariableEditor/Table/Cells";
import { checkDependsOn2, resolveDynProps } from "../../../../../utils/utils";
import { useVariablesStore } from "../../../../../store/variables-store";

export const DataObjectsTable = ({ data }) => {
    let keys;
    for (const rows of data) {
        if (rows.type === "folder") continue;
        keys = Object.keys(rows.setting);
        break;
    }

    if (!keys) return null;

    return (
        <Table.Root size={"sm"} stickyHeader>
            <Table.Header>
                <Table.Row background={"bg.subtle"}>
                    {keys.map((key, index) => {
                        return (
                            <Table.ColumnHeader key={key + "_" + index}>
                                {PARAM_DEFINITIONS[key].label}
                            </Table.ColumnHeader>
                        );
                    })}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((element, index) => {
                    if (element.type === "folder") return null;
                    return <TableRow key={element.id} element={element} />;
                })}
            </Table.Body>
        </Table.Root>
    );
};

const TableRow = ({ element }) => {
    const settings = useVariablesStore((state) => state.settings);

    return (
        <Table.Row
            background={"transparent"}
            className="group"
            _hover={{ bg: "bg.muted" }}
        >
            {Object.keys(element.setting).map((key, index) => {
                //if (key === "variable") return null;

                const definition = PARAM_DEFINITIONS[key];
                if (!definition) return null;

                if (
                    definition.dependsOn &&
                    !checkDependsOn2(element, definition.dependsOn, settings)
                ) {
                    return (
                        <Table.Cell
                            key={element.id + "_" + key}
                            minW={"150px"}
                            maxW={"150px"}
                            p={"0.5"}
                        />
                    );
                }

                const dynProps = resolveDynProps(
                    element,
                    definition.rules,
                    settings
                );

                return (
                    <Table.Cell
                        key={element.id + "_" + key}
                        minW={"150px"}
                        maxW={"150px"}
                        p={"0.5"}
                    >
                        {key === "type" ? (
                            <TypeCell
                                id={element.id}
                                type={element.setting[key]}
                            />
                        ) : (
                            <BaseInput
                                value={element.setting[key]}
                                id={element.id}
                                inputParam={key}
                                {...dynProps}
                            />
                        )}
                    </Table.Cell>
                );
            })}
        </Table.Row>
    );
};
