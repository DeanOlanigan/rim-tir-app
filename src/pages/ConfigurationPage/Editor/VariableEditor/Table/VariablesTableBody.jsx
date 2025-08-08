import { Table } from "@chakra-ui/react";
import { VariablesTableRow } from "./VariablesTableRow";
import { memo } from "react";

export const VariablesTableBody = memo(function VariablesTableBody({ data }) {
    //console.log("RENDER VariablesTableBody");

    return (
        <Table.Body>
            {data.map((node) => {
                if (node.type === "folder") return null;
                return (
                    <VariablesTableRow
                        key={node.id}
                        id={node.id}
                        name={node.name}
                        path={node.path}
                        setting={node.setting}
                    />
                );
            })}
        </Table.Body>
    );
});
