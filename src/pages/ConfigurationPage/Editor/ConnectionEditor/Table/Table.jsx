import { Table } from "@chakra-ui/react";
import { TableRow } from "./TableRow";
import { configuratorConfig } from "@/utils/configurationParser";

export const DataObjectsTable = ({ data }) => {
    const node = data?.find((node) => node.type !== "folder");
    if (!node) return null;
    const settings = configuratorConfig.nodePaths[node.path]?.settings;
    if (!settings) return null;
    const labels = Object.values(settings).map((setting) => setting.label);

    return (
        <Table.Root size={"sm"} stickyHeader>
            <Table.Header>
                <Table.Row>
                    {labels.map((label, index) => {
                        return (
                            <Table.ColumnHeader
                                key={index}
                                minW={"150px"}
                                maxW={"150px"}
                                p={"0.5"}
                            >
                                {label}
                            </Table.ColumnHeader>
                        );
                    })}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((node) => {
                    if (node.type === "folder") return null;
                    return <TableRow key={node.id} element={node} />;
                })}
            </Table.Body>
        </Table.Root>
    );
};
