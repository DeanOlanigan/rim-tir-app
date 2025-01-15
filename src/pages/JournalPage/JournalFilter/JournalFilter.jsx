import { useState } from "react";
import { Card } from "@chakra-ui/react";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot 
} from "../../../components/ui/accordion";

import ArchiveFilter from "./ArchiveFilter";
import VariablesChoser from "./VariablesChoser";
import MessageTypes from "./MessageTypes";
import GroupFilter from "./GroupFilter";
import FilterControls from "./FilterControls";
import { defaultFilters } from "./filterOptions";

function JournalFilter() {
    console.log("Render JournalFilter");
    const [filters, setFilters] = useState(defaultFilters);

    return (
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
            <Card.Body gap={"2"} flex={"1"} display={"flex"} py={"1"} my={"1.5rem"}
                overflow={"auto"} flexDirection={"column"} minH={"0"}>
                
                <AccordionRoot multiple size={"sm"}>
                    <AccordionItem value="1">
                        <AccordionItemTrigger>Архив</AccordionItemTrigger>
                        <AccordionItemContent>
                            <ArchiveFilter filters={filters} setFilters={setFilters}/>
                        </AccordionItemContent>
                    </AccordionItem>
                    <AccordionItem value="2">
                        <AccordionItemTrigger>Группы</AccordionItemTrigger>
                        <AccordionItemContent>
                            <GroupFilter filters={filters} setFilters={setFilters}/>
                        </AccordionItemContent>
                    </AccordionItem>
                    <AccordionItem value="3">
                        <AccordionItemTrigger>Типы сообщений</AccordionItemTrigger>
                        <AccordionItemContent>
                            <MessageTypes filters={filters} setFilters={setFilters}/>
                        </AccordionItemContent>
                    </AccordionItem>
                </AccordionRoot>
                <VariablesChoser filters={filters} setFilters={setFilters}/>
            </Card.Body>
            <Card.Footer justifyContent={"space-between"}>
                <FilterControls filters={filters} setFilters={setFilters}/>
            </Card.Footer>
        </Card.Root>
    );
}

export default JournalFilter;
