import { Card, Table } from "@chakra-ui/react";
import { useEffect } from "react";

function JournalView({ journalData }) {

    useEffect(() => {
        console.log(journalData);
    }, [journalData]);

    return (
        <Card.Root
            w={"100%"}
            h={"100%"}
            shadow={"xl"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <Card.Title>Журнал</Card.Title>
            </Card.Header>
            <Card.Body>
                <Table.Root size={"sm"} interactive>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>date</Table.ColumnHeader>
                            <Table.ColumnHeader>type</Table.ColumnHeader>
                            <Table.ColumnHeader>var</Table.ColumnHeader>
                            <Table.ColumnHeader>desc</Table.ColumnHeader>
                            <Table.ColumnHeader>val</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign={"end"}>group</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            journalData.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{item.date}</Table.Cell>
                                        <Table.Cell>{item.type}</Table.Cell>
                                        <Table.Cell>{item.var}</Table.Cell>
                                        <Table.Cell>{item.desc}</Table.Cell>
                                        <Table.Cell>{item.val}</Table.Cell>
                                        <Table.Cell textAlign={"end"}>{item.group}</Table.Cell>
                                    </Table.Row>
                                );
                            })
                        }
                    </Table.Body>
                </Table.Root>
            </Card.Body>
        </Card.Root>
    );
}

export default JournalView;
