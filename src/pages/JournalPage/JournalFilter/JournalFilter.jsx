import { useState } from "react";
import { Card } from "@chakra-ui/react";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot 
} from "../../../components/ui/accordion";
import { Button } from "../../../components/ui/button";

import ArchiveFilter from "./ArchiveFilter";
import VariablesChoser from "./VariablesChoser";
import MessageTypes from "./MessageTypes";
import GroupFilter from "./GroupFilter";

import PropTypes from "prop-types";

function JournalFilter({ onApplyFilters }) {

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 3);
    startDate.setMinutes(Math.round(startDate.getMinutes() / 15) * 15);

    const endDate = new Date();
    endDate.setDate(endDate.getDate());
    endDate.setMinutes(Math.round(endDate.getMinutes() / 15) * 15);

    const defaultFilters = {
        // TODO
        archiveStartDate : true,    // Убрать
        archiveEndDate : true,    // Убрать
        columnToggle : true,    // Убрать
        groupsToggle : true,    // Убрать
        eventTypeToggle : true,    // Убрать
        tableIdSort : "",    // Убрать

        archiveToggle : true,
        mountType : "search",
        rowsCount : 100,
        archiveStartDatePick : startDate,
        archiveEndDatePick : endDate,

        columns : [
            "columnDateCheck",
            "columnTypeCheck",
            "columnVarCheck",
            "columnDescCheck",
            "columnValCheck",
            "columnGroupCheck"
        ],

        groups : [
            "groupEmptyCheck",
            "groupDangerCheck",
            "groupWarnCheck",
            "groupStateCheck"
        ],

        events : [
            "eventTypeTSCheck",
            "eventTypeTUCheck"
        ],

        variables: []
    };
    const [filters, setFilters] = useState(defaultFilters);

    const handleApply = () => {
        onApplyFilters(filters);
    };

    const handleReset = () => {
        setFilters(defaultFilters);
        onApplyFilters(defaultFilters);
    };

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
                            <ArchiveFilter setFilters={setFilters} filters={filters} />
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
                <VariablesChoser filters={filters} setFilters={setFilters} />
            </Card.Body>
            <Card.Footer justifyContent={"space-between"}>
                <Button size={"xs"} disabled={!filters.columns.length} onClick={handleApply}>Применить</Button>
                <Button size={"xs"} onClick={handleReset}>Сбросить</Button>
            </Card.Footer>
        </Card.Root>
    );
}
JournalFilter.propTypes = {
    onApplyFilters: PropTypes.func,
};

export default JournalFilter;
