import { memo, useState } from "react";
import { Table, Text, Input, Box, Flex } from "@chakra-ui/react";
import { VariablesTransformerCell } from "./VariablesTransformerCell";
import {
    NumberInput,
    SelectInput,
    DebouncedTextarea,
} from "../../../InputComponents";
import { ToggleSection } from "../ToggleSection";

export const VariablesTableRow = memo(function VariablesTableRow(props) {
    //console.log("RENDER VariablesTableRow");
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
                <Input size={"xs"} value={isSpecial} />
                {/* <ToggleSection
                    id={id}
                    isSpecial={isSpecial}
                    archive={archive}
                    cmd={cmd}
                    isLua={isLua}
                    size={"sm"}
                /> */}
            </Table.Cell>
            <Table.Cell>
                <CellWrapper value={type}>
                    <SelectInput targetKey={"type"} id={id} value={type} />
                </CellWrapper>
            </Table.Cell>
            <Table.Cell>
                <CellWrapper value={group}>
                    <SelectInput targetKey={"group"} id={id} value={group} />
                </CellWrapper>
            </Table.Cell>
            <Table.Cell>
                <CellWrapper value={"under dev"}></CellWrapper>
                {/* TODO Доделать */}
            </Table.Cell>
            <Table.Cell>
                <CellWrapper>
                    <VariablesTransformerCell
                        id={id}
                        isLua={isLua}
                        luaExpression={luaExpression}
                        coefficient={coefficient}
                    />
                </CellWrapper>
            </Table.Cell>
            <Table.Cell>
                <CellWrapper value={specialCycleDelay}>
                    <NumberInput
                        targetKey={"specialCycleDelay"}
                        id={id}
                        value={specialCycleDelay}
                    />
                </CellWrapper>
            </Table.Cell>
            <Table.Cell>
                <CellWrapper value={description}>
                    <DebouncedTextarea
                        targetKey={"description"}
                        id={id}
                        value={description}
                    />
                </CellWrapper>
            </Table.Cell>
        </Table.Row>
    );
});

const CellWrapper = ({ value, children }) => {
    const [isEditing, setIsEditing] = useState(false);
    const handleDoubleClick = () => setIsEditing(true);
    const handleBlur = () => setIsEditing(false);
    return (
        <Flex
            h={"32px"}
            w={"100%"}
            alignItems={"center"}
            overflow={"hidden"}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
        >
            {isEditing ? children : <Text>{value}</Text>}
        </Flex>
    );
};
