import { Card, Box, createListCollection, Tabs, Flex, Stack, Button } from "@chakra-ui/react";
import { 
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../../components/ui/select";
import { Field } from "../../../components/ui/field";
import { ru } from "date-fns/locale";
import { DatePicker } from "../../../components/DatePicker/DatePicker";
import "react-datepicker/dist/react-datepicker.css";

const points = createListCollection({
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

const offsets = createListCollection({
    items: [
        { label: "10 секунд", value: "10",  },
        { label: "20 секунд", value: "20",  },
        { label: "30 секунд", value: "30",  },
        { label: "1 минута", value: "60",  },
        { label: "2 минуты", value: "120",  },
        { label: "3 минуты", value: "180",  },
        { label: "4 минуты", value: "240",  },
        { label: "5 минут", value: "300",  },
        { label: "10 минут", value: "600",  },
        { label: "15 минут", value: "900",  },
        { label: "20 минут", value: "1200",  },
        { label: "30 минут", value: "1800",  },
        { label: "1 час", value: "3600",  },
        { label: "2 часа", value: "7200",  },
        { label: "4 часа", value: "14400",  },
        { label: "6 часов", value: "21600",  },
        { label: "12 часов", value: "43200",  },
        { label: "24 часа", value: "86400",  },
    ],
});

function GraphSettings() {
    console.log("Render GraphSettings");

    return (
        <Card.Root
            w={"100%"}
            shadow={"xl"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{"_open": "scale-fade-in"}}
        >
            <Card.Header>
                <Card.Title>Настройки отображения</Card.Title>
            </Card.Header>
            <Card.Body>
                <Stack direction={"row"} gap={"2"}>
                    <Stack gap={"2"} w={"100%"} border={"1px red solid"} p={"2"} rounded={"md"}>
                        <Box maxW={"200px"}>
                            <SelectRoot
                                collection={points}
                                size={"xs"}
                                defaultValue={["100"]}
                            >
                                <SelectLabel>Количество точек:</SelectLabel>
                                <SelectTrigger clearable>
                                    <SelectValueText />
                                </SelectTrigger>
                                <SelectContent>
                                    {points.items.map((row) => (
                                        <SelectItem item={row} key={row.value}>
                                            {row.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectRoot>
                        </Box>
                        <Box maxW={"200px"}>
                            <Tabs.Root
                                defaultValue={"1"}
                                variant={"enclosed"}
                                size={"sm"}
                            >
                                <Tabs.List>
                                    <Tabs.Trigger value="1">Текущие</Tabs.Trigger>
                                    <Tabs.Trigger value="2">Период</Tabs.Trigger>
                                </Tabs.List>
                                <Box pos="relative" minH="150px" width="full">
                                    <Tabs.Content 
                                        value="1"
                                        position="absolute"
                                        inset="0"
                                        _open={{
                                            animationName: "fade-in, scale-in",
                                            animationDuration: "300ms",
                                        }}
                                        _closed={{
                                            animationName: "fade-out, scale-out",
                                            animationDuration: "120ms",
                                        }}
                                    >
                                        <SelectRoot
                                            collection={offsets}
                                            size={"xs"}
                                            defaultValue={["120"]}
                                        >
                                            <SelectLabel>Оффсет:</SelectLabel>
                                            <SelectTrigger clearable>
                                                <SelectValueText />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {offsets.items.map((row) => (
                                                    <SelectItem item={row} key={row.value}>
                                                        {row.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </SelectRoot>
                                    </Tabs.Content>
                                    <Tabs.Content 
                                        value="2"
                                        position="absolute"
                                        inset="0"
                                        _open={{
                                            animationName: "fade-in, scale-in",
                                            animationDuration: "300ms",
                                        }}
                                        _closed={{
                                            animationName: "fade-out, scale-out",
                                            animationDuration: "120ms",
                                        }}
                                    >
                                        <Stack p={"1"}>
                                            <Field label="Дата начала">
                                                <DatePicker
                                                    portalId="datepicker-portal"
                                                    popperPlacement="right-start"
                                                    showPopperArrow={false}
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
                                            </Field>
                                            <Field label="Дата окончания"   >
                                                <DatePicker
                                                    portalId="datepicker-portal"
                                                    popperPlacement="right-start"
                                                    showPopperArrow={false}
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
                                            </Field>
                                        </Stack>
                                    </Tabs.Content>
                                </Box>
                            </Tabs.Root>
                        </Box>
                    </Stack>
                    <Box w={"100%"}>
                        <Button size={"xs"} w={"100%"}>Добавить переменную</Button>
                        <Box w={"100%"} h={"100%"} border={"1px solid red"} p={"2"}>

                        </Box>
                    </Box>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
}

export default GraphSettings;