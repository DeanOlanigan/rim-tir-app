import { Table } from "@chakra-ui/react";
import { TableRow } from "./TableRow";
import { configuratorConfig } from "@/utils/configurationParser";
import { InfoTip } from "@/components/ui/toggle-tip";

export const DataObjectsTable = ({ data }) => {
    const node = data?.find((node) => node.type !== "folder");
    if (!node) return null;
    const settings = configuratorConfig.nodePaths[node.path]?.settings;
    if (!settings) return null;

    return (
        <Table.Root size={"sm"} stickyHeader interactive>
            <Table.Header>
                <Table.Row>
                    {Object.entries(settings).map(([key, setting]) => {
                        const info =
                            configuratorConfig.nodePaths[node.path]?.settings[
                                key
                            ]?.info;
                        return (
                            <Table.ColumnHeader
                                key={key}
                                minW={"150px"}
                                maxW={"150px"}
                            >
                                {setting.label}
                                {info && <InfoTip content={info} />}
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
