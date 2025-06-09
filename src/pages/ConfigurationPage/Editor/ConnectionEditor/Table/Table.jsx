import { Table } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "@/config/paramDefinitions";
import { InputController } from "@/pages/ConfigurationPage/InputComponents/InputController";
import { InputFactory } from "@/pages/ConfigurationPage/InputComponents/InputFactory";

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
                <Table.Row>
                    {keys.map((key, index) => {
                        return (
                            <Table.ColumnHeader
                                key={key + "_" + index}
                                minW={"150px"}
                                maxW={"150px"}
                                p={"0.5"}
                            >
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
                return (
                    <Table.Cell
                        key={element.id + "_" + key}
                        minW={"150px"}
                        maxW={"150px"}
                        p={"0.5"}
                    >
                        <InputController
                            inputType={key}
                            inputId={element.id}
                            value={element.setting[key]}
                            Factory={InputFactory}
                        />
                    </Table.Cell>
                );
            })}
        </Table.Row>
    );
};
