import { Input, Table } from "@chakra-ui/react";
import { useData } from "../hooks/useData";
import { useTableStore } from "../SettingsStore/tablestore";
import { RoleMenu } from "./Roles/RoleMenu";
import { RoleSelectorEditor } from "./Roles/RoleSelectorEditor";

const tableColumns = [
    { label: "Логин", value: "login" },
    { label: "Фамилия", value: "surname" },
    { label: "Имя", value: "name" },
    { label: "Отчество", value: "grandname" },
    { label: "Должность", value: "position" },
    { label: "Роль", value: "role" },
];

export const UserEditor = () => {
    const { live, selectedRows } = useTableStore();

    const selectedUsers = useData({ live, selectedRows });
    console.log(selectedUsers, "123");
    return <ManyUsers selectedUsers={selectedUsers} />;
};

// const OneUser = ({ selectedUsers }) => {
//     return (
//         <Table.Root>
//             <Table.Header>
//                 <Table.Row>
//                     {tableColumns.map((header) => (
//                         <Table.ColumnHeader
//                             key={header.value}
//                             bg={"colorPalette.solid"}
//                             color={"fg.inverted"}
//                             fontSize="sm"
//                             fontWeight="500"
//                             padding="4px"
//                             textAlign="center"
//                         >
//                             {header.label}
//                         </Table.ColumnHeader>
//                     ))}
//                 </Table.Row>
//             </Table.Header>
//             <Table.Body>
//                 {selectedUsers.map((row) => (
//                     <Table.Row key={row.login}>
//                         {Object.keys(row).map((key) => (
//                             <Table.Cell
//                                 key={key}
//                                 textAlign="center"
//                                 fontSize="sm"
//                                 fontWeight="500"
//                                 padding="4px"
//                             >
//                                 {row[key]}
//                             </Table.Cell>
//                         ))}
//                     </Table.Row>
//                 ))}
//             </Table.Body>
//         </Table.Root>
//     );
// };

const ManyUsers = ({ selectedUsers }) => {
    return (
        <Table.ScrollArea height={"xl"} overflow={"auto"}>
            <Table.Root stickyHeader>
                <Table.Header>
                    <Table.Row>
                        {tableColumns.map((header) => (
                            <Table.ColumnHeader
                                key={header.value}
                                bg={"colorPalette.solid"}
                                color={"fg.inverted"}
                                fontSize="sm"
                                fontWeight="500"
                                padding="4px"
                                textAlign="center"
                            >
                                {header.value === "role" ? (
                                    <RoleMenu noPortal />
                                ) : (
                                    header.label
                                )}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {selectedUsers.map((row) => (
                        <Table.Row key={row.login}>
                            {Object.keys(row).map((key) => (
                                <Table.Cell
                                    key={key}
                                    textAlign="center"
                                    fontSize="sm"
                                    fontWeight="500"
                                    padding="4px"
                                >
                                    {key === "role" ? (
                                        <RoleSelectorEditor
                                            data={row[key]}
                                            noPortal
                                        />
                                    ) : (
                                        <Input
                                            value={row[key]}
                                            size={"xs"}
                                            textAlign={"center"}
                                        />
                                    )}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
};
