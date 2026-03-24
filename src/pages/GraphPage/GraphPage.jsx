import { VStack } from "@chakra-ui/react";
import { Header } from "./Header";
import { DataSets } from "./DataSets";
import { GraphBlock } from "./GraphBlock";
import { getLocalTimeZone, today } from "@internationalized/date";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { graphFormSchema } from "./graph-form-schema";

function getDefaultValues() {
    const tz = getLocalTimeZone();
    const now = today(tz);
    const threeDaysAgo = now.subtract({ days: 3 });

    return {
        mode: "period", // "period" | "realTime"
        range: [threeDaysAgo, now],
        pointLimit: 150,
        datasets: [],
    };
}

function normalizeGraphForm(values) {
    const from = values.range?.[0] ?? null;
    const to = values.range?.[1] ?? null;

    const utcFrom = from ? from.toDate().toISOString() : null;
    const utcTo = to ? to.toDate().toISOString() : null;

    return {
        mode: values.mode,
        range: values.mode === "period" ? { utcFrom, utcTo } : null,
        pointLimit: values.mode === "period" ? Number(values.pointLimit) : null,
        datasets: values.datasets.map((ds) => ({
            id: ds.id,
            variable: ds.variable,
            variableId: ds.variableId,
            alias: ds.alias?.trim() || "",
            color: ds.color,
        })),
    };
}

function GraphPage() {
    const defaultValues = useMemo(() => getDefaultValues(), []);
    const form = useForm({
        defaultValues,
        mode: "onChange",
        resolver: zodResolver(graphFormSchema),
    });

    const { handleSubmit, trigger } = form;

    useEffect(() => {
        trigger();
    }, [trigger]);

    const [appliedConfig, setAppliedConfig] = useState(() =>
        normalizeGraphForm(getDefaultValues()),
    );

    const onSubmit = handleSubmit((values) => {
        const normalized = normalizeGraphForm(values);
        setAppliedConfig(normalized);
    });

    return (
        <VStack
            w="full"
            h="full"
            data-state="open"
            animationDuration="slow"
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <FormProvider {...form}>
                <VStack as="form" onSubmit={onSubmit} w="full" gap={4}>
                    <Header />
                    <DataSets />
                </VStack>
            </FormProvider>
            <GraphBlock appliedConfig={appliedConfig} />
        </VStack>
    );
}

export default GraphPage;
