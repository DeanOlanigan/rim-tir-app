import { memo /* useState */ } from "react";
import { Table } from "@chakra-ui/react";
import { VariablesTableHeader } from "./VariablesTableHeader";
import { VariablesTableBody } from "./VariablesTableBody";

export const VariablesTable = memo(function TableConfig({ data }) {
    //console.log("RENDER VariablesTable");
    return (
        <Table.Root>
            <VariablesTableHeader />
            <VariablesTableBody data={data} />
        </Table.Root>
    );
});
