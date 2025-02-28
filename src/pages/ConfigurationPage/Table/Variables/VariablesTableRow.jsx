import { memo } from "react";
import { Table, Text, Input } from "@chakra-ui/react";
import {
    DescriptionCell,
    CycleDelayCell,
    SelectGroupCell,
    VariablesTransformerCell,
    TableCheckboxCardGroupCell,
    SelectTypeCell,
} from "./Cells";

export const VariablesTableRow = memo(function VariablesTableRow(props) {
    console.log("RENDER VariablesTableRow");
    const {
        id,
        name,
        isSpecial,
        isLua,
        archive,
        cmd,
        type,
        group,
        measurement,
        luaExpression,
        coefficient,
        specialCycleDelay,
        description,
    } = props;

    return (
        <Table.Row background={"bg.subtle"}>
            <Table.Cell>
                <Text>{name}</Text>
            </Table.Cell>
            <Table.Cell>
                <TableCheckboxCardGroupCell
                    isSpecial={isSpecial}
                    isLua={isLua}
                    archive={archive}
                    cmd={cmd}
                    id={id}
                />
            </Table.Cell>
            <Table.Cell>
                <SelectTypeCell type={type} id={id} />
            </Table.Cell>
            <Table.Cell>
                <SelectGroupCell group={group} id={id} />
            </Table.Cell>
            <Table.Cell>
                <Input value={measurement} size={"xs"} />
            </Table.Cell>
            <Table.Cell>
                <VariablesTransformerCell
                    id={id}
                    isLua={isLua}
                    luaExpression={luaExpression}
                    coefficient={coefficient}
                />
            </Table.Cell>
            <Table.Cell>
                <CycleDelayCell
                    isSpecial={isSpecial}
                    specialCycleDelay={specialCycleDelay}
                    id={id}
                />
            </Table.Cell>
            <Table.Cell>
                <DescriptionCell description={description} id={id} />
            </Table.Cell>
        </Table.Row>
    );
});
