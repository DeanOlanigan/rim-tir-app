import { memo } from "react";
import { Table, Text } from "@chakra-ui/react";
import { VariablesTransformerCell } from "./VariablesTransformerCell";
import {
    NumberInput,
    SelectInput,
    DebouncedTextarea,
} from "../../../InputComponents";
import { ToggleSection } from "../ToggleSection";

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
        /* measurement, */
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
            <Table.Cell minW={"170px"}>
                <ToggleSection
                    id={id}
                    isSpecial={isSpecial}
                    archive={archive}
                    cmd={cmd}
                    isLua={isLua}
                    size={"sm"}
                />
            </Table.Cell>
            <Table.Cell>
                <SelectInput targetKey={"type"} id={id} value={type} />
            </Table.Cell>
            <Table.Cell>
                <SelectInput targetKey={"group"} id={id} value={group} />
            </Table.Cell>
            <Table.Cell>
                {/* TODO Доделать */}
                <Text>under dev.</Text>
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
                <NumberInput
                    targetKey={"specialCycleDelay"}
                    id={id}
                    value={specialCycleDelay}
                />
            </Table.Cell>
            <Table.Cell>
                <DebouncedTextarea
                    targetKey={"description"}
                    id={id}
                    value={description}
                />
            </Table.Cell>
        </Table.Row>
    );
});
