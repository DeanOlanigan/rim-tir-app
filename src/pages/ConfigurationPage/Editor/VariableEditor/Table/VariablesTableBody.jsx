import { Table } from "@chakra-ui/react";
import { VariablesTableRow } from "./VariablesTableRow";
import { memo } from "react";

export const VariablesTableBody = memo(function VariablesTableBody({ data }) {
    //console.log("RENDER VariablesTableBody");
    return (
        <Table.Body>
            {data.map((element) => {
                if (element.type === "folder") return null;
                return (
                    <VariablesTableRow
                        key={element.id}
                        id={element.id}
                        name={element.name}
                        setting={element.setting}
                    />
                );
            })}
        </Table.Body>
    );
});
