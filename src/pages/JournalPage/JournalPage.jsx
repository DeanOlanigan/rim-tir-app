import { useState } from "react";
import { Card, Container, Heading, HStack, createListCollection, Stack } from "@chakra-ui/react";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "../../components/ui/accordion";
import { Field } from "../../components/ui/field";
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
import { Checkbox } from "../../components/ui/checkbox";
import { DatePicker } from "../../components/DatePicker/DatePicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";
//import "./datepicker.css";

function JournalPage() {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [isArchiveEnabled, setIsArchiveEnabled] = useState(true);

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
                display={"flex"}
                flexDirection={"row"}
                align={"flex-start"}
                minH={"0"}
            >
                <Card.Root
                    w={"30%"}
                    maxH={"100%"}
                    flexShrink={"1"}
                    flexGrow={"1"}
                    shadow={"xl"}
                    data-state={"open"}
                    overflow={"hidden"}
                    animationDuration={"slow"}
                    animationStyle={{
                        _open: "scale-fade-in",
                    }}
                >
                    <Card.Header>
                        <Card.Title>Фильтры</Card.Title>
                    </Card.Header>
                    <Card.Body gap={"2"} flex={"1"} display={"flex"} py={"0"} my={"1.5rem"}
                        overflow={"auto"} flexDirection={"column"} minH={"0"}>
                        <AccordionRoot multiple size={"sm"}>
                            <AccordionItem value="1">
                                <AccordionItemTrigger>Архив</AccordionItemTrigger>
                                <AccordionItemContent>
                                    <Stack>
                                        <Field orientation="horizontal" label="Архив">
                                            <Switch size={"sm"} checked={isArchiveEnabled} onCheckedChange={(e)=> setIsArchiveEnabled(e.checked)} />
                                        </Field>
                                        <DatePicker
                                            selected={startDate}
                                            portalId="datepicker-portal"
                                            popperPlacement="right-start"
                                            showPopperArrow={false}
                                            disabled={!isArchiveEnabled}
                                            onChange={(date) => setStartDate(date)}
                                            locale={ru}
                                            timeFormat="HH:mm"
                                            timeCaption="Время"
                                            timeIntervals={15}
                                            showTimeSelect={true}
                                            dateFormat={"yyyy-MM-dd HH:mm"}
                                            datePickerSize="xs"
                                            inputProps={{
                                                size: "xs",
                                            }}
                                            rootProps={{
                                                p: "2px",
                                            }}
                                            isClearable
                                            placeholderText="Дата начала"
                                        />
                                        <DatePicker
                                            selected={endDate}
                                            portalId="datepicker-portal"
                                            popperPlacement="right-start"
                                            showPopperArrow={false}
                                            disabled={!isArchiveEnabled}
                                            onChange={(date) => setEndDate(date)}
                                            locale={ru}
                                            timeFormat="HH:mm"
                                            timeCaption="Время"
                                            timeIntervals={15}
                                            showTimeSelect={true}
                                            dateFormat={"yyyy-MM-dd HH:mm"}
                                            datePickerSize="xs"
                                            inputProps={{
                                                size: "xs",
                                            }}
                                            rootProps={{
                                                p: "2px",
                                            }}
                                            isClearable
                                            placeholderText="Дата окончания"
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
                                    </Stack>
                                </AccordionItemContent>
                            </AccordionItem>
                            <AccordionItem value="2">
                                <AccordionItemTrigger>Столбцы</AccordionItemTrigger>
                                <AccordionItemContent>
                                    <Stack>
                                        <Checkbox>Дата и время</Checkbox>
                                        <Checkbox>Тип</Checkbox>
                                        <Checkbox>Переменные</Checkbox>
                                        <Checkbox>Описание</Checkbox>
                                        <Checkbox>Значение</Checkbox>
                                        <Checkbox>Группы</Checkbox>
                                    </Stack>
                                </AccordionItemContent>
                            </AccordionItem>
                            <AccordionItem value="3">
                                <AccordionItemTrigger>Группы</AccordionItemTrigger>
                                <AccordionItemContent>
                                    <Stack>
                                        <Checkbox>Без группы</Checkbox>
                                        <Checkbox>Аварийные</Checkbox>
                                        <Checkbox>Предупредительные</Checkbox>
                                        <Checkbox>Оперативного состояния</Checkbox>
                                    </Stack>
                                </AccordionItemContent>
                            </AccordionItem>
                            <AccordionItem value="4">
                                <AccordionItemTrigger>Типы сообщений</AccordionItemTrigger>
                                <AccordionItemContent>
                                    <Stack>
                                        <Checkbox>ТС</Checkbox>
                                        <Checkbox>Пользовательские ТУ</Checkbox>
                                    </Stack>
                                </AccordionItemContent>
                            </AccordionItem>
                        </AccordionRoot>
                        <SelectRoot
                            collection={rows}
                            size={"xs"}
                            multiple 
                        >
                            <SelectLabel>Переменные:</SelectLabel>
                            <SelectTrigger clearable>
                                <SelectValueText placeholder="Выберите переменные" />
                            </SelectTrigger>
                            <SelectContent>
                                {rows.items.map((row) => (
                                    <SelectItem item={row} key={row.value}>
                                        {row.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot>
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