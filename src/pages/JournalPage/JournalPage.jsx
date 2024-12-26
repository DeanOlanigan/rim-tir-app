import { useState } from "react";
import { Card, Container, Heading, HStack, createListCollection } from "@chakra-ui/react";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "../../components/ui/accordion";
import { 
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import "./datepicker.css";

function JournalPage() {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const rows = createListCollection({
        items: [
            { label: "10", value: "10" },
            { label: "20", value: "20" },
            { label: "50", value: "50" },
            { label: "100", value: "100" },
            { label: "200", value: "200" },
            { label: "500", value: "500" },
            { label: "1000", value: "1000" },
        ],
    });

    return (
        <Container
            maxW={"6xl"}
            flex={"1"}
            display={"flex"}
            flexDirection={"column"}
            minH={"0"}
            gap={"2"}
        >
            <Heading>Журнал</Heading>
            <HStack
                w={"100%"}
                flex={"1"}
                align={"flex-start"}
            >
                <Card.Root
                    h={"100%"}
                    w={"30%"}
                    shadow={"xl"}
                    data-state={"open"}
                    animationDuration={"slow"}
                    animationStyle={{
                        _open: "scale-fade-in",
                    }}
                >
                    <Card.Header>
                        <Card.Title>Фильтры</Card.Title>
                    </Card.Header>
                    <Card.Body gap={"2"}>
                        <AccordionRoot multiple size={"sm"}>
                            <AccordionItem value="1">
                                <AccordionItemTrigger>Архив</AccordionItemTrigger>
                                <AccordionItemContent>
                                    <Switch size={"sm"}>Архив</Switch>
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => setDateRange(update)}
                                        isClearable={true}
                                    />
                                    <SelectRoot
                                        collection={rows}
                                        size={"xs"}
                                        defaultValue={["100"]}
                                    >
                                        <SelectLabel>Количество строк:</SelectLabel>
                                        <SelectTrigger>
                                            <SelectValueText/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rows.items.map((row) => (
                                                <SelectItem item={row} key={row.value}>
                                                    {row.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </SelectRoot>
                                </AccordionItemContent>
                            </AccordionItem>
                            <AccordionItem value="2">
                                <AccordionItemTrigger>Столбцы</AccordionItemTrigger>
                                <AccordionItemContent>content</AccordionItemContent>
                            </AccordionItem>
                            <AccordionItem value="3">
                                <AccordionItemTrigger>Группы</AccordionItemTrigger>
                                <AccordionItemContent>content</AccordionItemContent>
                            </AccordionItem>
                            <AccordionItem value="4">
                                <AccordionItemTrigger>Типы сообщений</AccordionItemTrigger>
                                <AccordionItemContent>content</AccordionItemContent>
                            </AccordionItem>
                        </AccordionRoot>
                    </Card.Body>
                    <Card.Footer justifyContent={"space-between"}>
                        <Button size={"xs"}>Применить</Button>
                        <Button size={"xs"}>Сбросить</Button>
                    </Card.Footer>
                </Card.Root>
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

                    </Card.Body>
                </Card.Root>
            </HStack>
        </Container>
    );
}

export default JournalPage;