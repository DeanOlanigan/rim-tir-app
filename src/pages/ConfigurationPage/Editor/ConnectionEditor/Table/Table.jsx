import { Table, Flex, IconButton } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "../../../../../config/paramDefinitions";
import { BaseInput } from "../../../InputComponents/BaseInput";
import { useState } from "react";
import { LuPencil, LuPencilOff } from "react-icons/lu";

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
                    <Table.ColumnHeader w={"55px"} />
                    {keys.map((key, index) => {
                        return (
                            <Table.ColumnHeader key={index}>
                                {PARAM_DEFINITIONS[key].label}
                            </Table.ColumnHeader>
                        );
                    })}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((element, index) => {
                    if (element.type === "folder") return null;
                    return <TableRow key={index} element={element} />;
                })}
            </Table.Body>
        </Table.Root>
    );
};

const TableRow = ({ element }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Table.Row
            background={"transparent"}
            className="group"
            _hover={{ bg: "bg.muted" }}
        >
            <Table.Cell w={"55px"} p={"0.5"}>
                <Flex gap={"1"} justify={"center"}>
                    {isEditing ? (
                        <>
                            <IconButton
                                size={"xs"}
                                variant={"plain"}
                                onClick={() => setIsEditing(false)}
                                opacity={"0"}
                                _groupHover={{ opacity: 1 }}
                            >
                                <LuPencilOff />
                            </IconButton>
                        </>
                    ) : (
                        <IconButton
                            size={"xs"}
                            variant={"plain"}
                            onClick={() => setIsEditing(true)}
                            opacity={"0"}
                            _groupHover={{ opacity: 1 }}
                        >
                            <LuPencil />
                        </IconButton>
                    )}
                </Flex>
            </Table.Cell>
            {Object.keys(element.setting).map((key, index) => {
                //if (key === "variable") return null;
                return (
                    <Table.Cell
                        key={index}
                        minW={"150px"}
                        maxW={"150px"}
                        p={"0.5"}
                    >
                        <BaseInput
                            value={element.setting[key]}
                            id={element.id}
                            inputParam={key}
                        />
                        {/* {isEditing ? (
                            <BaseInput
                                value={element.setting[key]}
                                id={element.id}
                                inputParam={key}
                            />
                        ) : (
                            <Text truncate lineClamp={2}>
                                {element.setting[key]}
                            </Text>
                        )} */}
                    </Table.Cell>
                );
            })}
        </Table.Row>
    );
};
