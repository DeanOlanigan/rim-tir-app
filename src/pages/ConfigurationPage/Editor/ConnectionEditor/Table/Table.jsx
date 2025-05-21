import { Table } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "@/config/paramDefinitions";
import { BaseInput } from "@/pages/ConfigurationPage/InputComponents";
import { TypeCell } from "@/pages/ConfigurationPage/Editor/VariableEditor/Table/Cells"; // TODO спорно
import { validateVisability } from "@/utils/validator";

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
                {data.map((element) => {
                    if (element.type === "folder") return null;
                    return <TableRow key={element.id} element={element} />;
                })}
            </Table.Body>
        </Table.Root>
    );
};

const TableRow = ({ element }) => {
    return (
        <Table.Row
            background={"transparent"}
            className="group"
            _hover={{ bg: "bg.muted" }}
        >
            {Object.keys(element.setting).map((key) => {
                //if (key === "variable") return null;

                const definition = PARAM_DEFINITIONS[key];
                if (!definition) return null;
                const isVisible = validateVisability(definition, element.id);

                if (!isVisible) {
                    return <Table.Cell key={element.id + "_" + key} />;
                }

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
                            />
                        )}
                    </Table.Cell>
                );
            })}
        </Table.Row>
    );
};
